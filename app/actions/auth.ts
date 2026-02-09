"use server";

import { setSession, removeSession, verifyPassword, hashPassword } from "@/lib/auth";
import { User } from "@/lib/types";

export async function signIn(email: string, password: string): Promise<{ error: string | null }> {
  const { getUserByEmail, updateUserWpId } = await import("@/lib/users");

  // 1. Check local users
  const localUser = await getUserByEmail(email);
  if (localUser && verifyPassword(password, localUser.password)) {
    let wpId = localUser.wp_id;

    if (!wpId) {
      try {
        // Attempt to find a matching WordPress user ID by email using admin credentials
        const adminAuth = Buffer.from(
          `${process.env.WP_USER}:${process.env.WP_APPLICATION_PASSWORD}`
        ).toString("base64");
        const wpResponse = await fetch(
          `${process.env.WORDPRESS_URL}/wp-json/wp/v2/users?search=${encodeURIComponent(email)}&context=edit`,
          {
            headers: {
              Authorization: `Basic ${adminAuth}`,
              'Content-Type': 'application/json',
            },
            cache: 'no-store', // Crucial: Prevents Next.js from trying to cache this during build
          }
        );
        if (wpResponse.ok) {
          const wpUsers = await wpResponse.json();
          const matchingUser = wpUsers.find((u: any) => u.email === email);
          if (matchingUser) {
            wpId = matchingUser.id;
            // Update local DB
            await updateUserWpId(localUser.id, wpId as number);
          }
        }
      } catch (err) {
        console.error("Failed to fetch matching WP user:", err);
      }
    }

    const user: User = {
      id: localUser.id.toString(),
      name: localUser.name,
      email: localUser.email,
      wpId,
    };
    await setSession(user);
    return { error: null };
  }

  // 2. Check against WordPress REST API for WordPress users
  try {
    const auth = Buffer.from(`${email}:${password}`).toString("base64");
    const response = await fetch(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/users/me`, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const user: User = {
        id: data.id.toString(),
        name: data.name,
        email: email,
        wpId: data.id,
      };
      await setSession(user);
      return { error: null };
    }
  } catch (err) {
    console.error("Auth error:", err);
  }

  return { error: "Invalid credentials" };
}

export async function signUp(name: string, email: string, password: string): Promise<{ error: string | null }> {
  const { getUserByEmail, createUser, updateUserWpId } = await import("@/lib/users");
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return { error: "User already exists" };
    }

    const hashedPassword = hashPassword(password);

    // First create local user
    let newUser = await createUser({
      name,
      email,
      password: hashedPassword,
    });

    // Try to find or create WP user
    let wpId: number | undefined;
    try {
      const adminAuth = Buffer.from(
        `${process.env.WP_USER}:${process.env.WP_APPLICATION_PASSWORD}`
      ).toString("base64");

      // Search first
      const wpSearchResponse = await fetch(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/users?search=${email}&context=edit`, {
        headers: {
          Authorization: `Basic ${adminAuth}`,
        },
      });

      if (wpSearchResponse.ok) {
        const wpUsers = await wpSearchResponse.json();
        const matchingUser = wpUsers.find((u: any) => u.email === email);
        if (matchingUser) {
          wpId = matchingUser.id;
        }
      }

      // Create if not found
      if (!wpId) {
        const username = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "") + Math.floor(Math.random() * 1000);
        const createResponse = await fetch(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/users`, {
          method: "POST",
          headers: {
            Authorization: `Basic ${adminAuth}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            name,
            email,
            password,
            role: "author",
          }),
        });

        if (createResponse.ok) {
          const data = await createResponse.json();
          wpId = data.id;
        }
      }

      if (wpId) {
        await updateUserWpId(newUser.id, wpId);
      }
    } catch (err) {
      console.error("Failed to manage WP user during signup:", err);
    }

    // Auto sign-in
    const user: User = {
      id: newUser.id.toString(),
      name: newUser.name,
      email: newUser.email,
      wpId,
    };
    await setSession(user);

    return { error: null };
  } catch (err) {
    console.error("Sign up error:", err);
    return { error: "Failed to create account" };
  }
}

export async function signOut() {
  await removeSession();
}

export async function getCurrentUser(): Promise<User | null> {
  const { getSession } = await import("@/lib/auth");
  return getSession();
}