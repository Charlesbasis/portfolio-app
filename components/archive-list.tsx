import Link from "next/link";

interface ArchiveListProps<T> {
  items: T[];
  title: string;
  getItemHref?: (item: T) => string;
  getItemLabel?: (item: T) => string;
  emptyMessage?: string;
}

export function ArchiveList<T extends any>({ 
  items, 
  title, 
  getItemHref, 
  getItemLabel, 
  emptyMessage = "No items found." 
}: ArchiveListProps<T>) {
  if (!items || items.length === 0) {
    return (
      <div className="container py-8 text-center text-muted-foreground">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <div className="grid gap-4">
        {items.map((item: any, i: number) => {
          const label = getItemLabel ? getItemLabel(item) : (item.name || item.title?.rendered || "Untitled");
          
          return (
            <div key={item.id || i} className="p-4 border rounded-lg">
               <h2 className="text-xl font-semibold">{label}</h2>
               {item.description && <p className="text-muted-foreground">{item.description}</p>}
               {getItemHref && (
                 <Link href={getItemHref(item)} className="text-primary hover:underline mt-2 inline-block">
                   View
                 </Link>
               )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
