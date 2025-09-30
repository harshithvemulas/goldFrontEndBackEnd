"use client";

import cn from "@/lib/utils";
import {
  ColumnDef,
  OnChangeFn,
  SortingState,
  TableState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown2, ArrowLeft, ArrowRight, Warning2 } from "iconsax-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import RCPagination from "rc-pagination";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

type Props = {
  data: any;
  isLoading?: boolean;
  structure: ColumnDef<any>[];
  sorting?: SortingState;
  setSorting?: OnChangeFn<SortingState>;
  padding?: boolean;
  className?: string;
  onRefresh?: () => void;
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
};

export default function DataTable({
  data,
  isLoading = false,
  structure,
  sorting,
  setSorting,
  padding = false,
  className,
  onRefresh,
  pagination,
}: Props) {
  const columns = useMemo<ColumnDef<any>[]>(() => structure, [structure]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { t } = useTranslation();

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      sorting,
      onRefresh,
    } as Partial<TableState & { onRefresh: () => void }> | undefined,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: false,
  });

  if (isLoading) {
    return (
      <div className="rounded-md bg-background p-10">
        <div className="flex h-32 w-full items-center justify-center">
          {t("Loading...")}
        </div>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="rounded-md bg-background p-10">
        <div className="flex h-32 w-full flex-col items-center justify-center gap-4">
          <Warning2 size="38" variant="Bulk" className="text-primary-400" />
          {t("No data found!")}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        `${padding ? "p-3" : "p-0"} overflow-x-hidden rounded-md bg-background`,
        className,
      )}
    >
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-none bg-background hover:bg-background"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-expect-error
                  className={cn("", header?.column?.columnDef?.meta?.className)}
                >
                  {header.isPlaceholder ? null : (
                    <Button
                      variant="ghost"
                      className="flex h-10 w-full cursor-pointer items-center justify-between px-0 text-xs font-bold capitalize text-secondary-text hover:bg-transparent"
                      {...{
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {t(
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        ) as string,
                      )}
                      {header.column.getCanSort() &&
                        ({
                          asc: (
                            <ArrowDown2
                              size="16"
                              className="text-secondary-text"
                              transform="rotate(180)"
                            />
                          ),
                          desc: (
                            <ArrowDown2
                              size="16"
                              className="text-secondary-text"
                            />
                          ),
                        }[header.column.getIsSorted() as string] ?? (
                          <ArrowDown2 size="16" className="text-transparent" />
                        ))}
                    </Button>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className="cursor-default border-none odd:bg-accent"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell className="py-3 text-sm font-semibold" key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pagination && pagination.total > 10 && (
        <div className="pb-2 pt-6">
          <RCPagination
            showTotal={(total, range) =>
              t(`Showing {{start}}-{{end}} of {{total}}`, {
                start: range[0],
                end: range[1],
                total,
              })
            }
            align="start"
            current={pagination?.page}
            total={pagination?.total}
            pageSize={pagination?.limit}
            hideOnSinglePage
            showLessItems
            onChange={(page) => {
              const params = new URLSearchParams(searchParams);
              params.set("page", page.toString());
              router.push(`${pathname}?${params.toString()}`);
            }}
            className="flex flex-row items-center justify-between gap-2"
            prevIcon={(props) => (
              <a {...props}>
                <ArrowLeft size="18" />
              </a>
            )}
            nextIcon={(props) => (
              <a {...props}>
                <ArrowRight size="18" />
              </a>
            )}
          />
        </div>
      )}
    </div>
  );
}
