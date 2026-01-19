export type NavProps = {
  className?: string;
  children?: React.ReactNode;
  id?: string;
};

export interface User {
  id: string;
  name: string;
  email: string;
  wpId?: number;
}
