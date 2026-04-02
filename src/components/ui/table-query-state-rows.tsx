import { TableStateRow } from "@/components/ui/table-state-row";

type TableQueryStateRowsProps = {
  loading: boolean;
  error?: string;
  isEmpty: boolean;
  colSpan: number;
  loadingMessage: string;
  emptyMessage: string;
};

export function TableQueryStateRows({
  loading,
  error,
  isEmpty,
  colSpan,
  loadingMessage,
  emptyMessage,
}: TableQueryStateRowsProps) {
  return (
    <>
      {loading ? (
        <TableStateRow colSpan={colSpan} message={loadingMessage} />
      ) : null}

      {!loading && error ? (
        <TableStateRow colSpan={colSpan} tone="danger" message={error} />
      ) : null}

      {!loading && !error && isEmpty ? (
        <TableStateRow colSpan={colSpan} message={emptyMessage} />
      ) : null}
    </>
  );
}
