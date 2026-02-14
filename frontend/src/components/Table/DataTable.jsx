import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const DataTable = ({ columns, data, rowClassName, onRowClick }) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10, 
      },
    },
  });

  return (
    //* Contenedor principal con altura controlada opcional
    <div className="w-full flex flex-col max-h-[80vh]">

      {/* SECCIÓN FIJA: Filtro global */}
      <div className="sticky top-0 z-30 bg-white py-4 border-b">
        <div className="flex items-center justify-between pl-2">
          <input
            placeholder="Buscar "
            value={globalFilter ?? ''}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm pl-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-200 outline-none"
          />

        </div>
      </div>

      {/* CONTENEDOR CON SCROLL PARA LA TABLA */}
      <div className="overflow-auto rounded-md border mt-2">
        <Table>
          <TableHeader className="sticky top-0 z-20 bg-gray-100 shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="cursor-pointer select-none border-b hover:bg-gray-200 transition-colors"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center justify-between gap-2 group">
                      {/* Texto del Header */}
                      <span className="font-bold text-gray-700">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </span>

                      {/* Iconos de Flechas Amigables */}
                      <div className="flex flex-col text-[10px] leading-none opacity-40 group-hover:opacity-100 transition-opacity">
                        <span className={header.column.getIsSorted() === 'asc' ? "text-blue-600 font-bold scale-125" : ""}>
                          ▲
                        </span>
                        <span className={header.column.getIsSorted() === 'desc' ? "text-blue-600 font-bold scale-125" : ""}>
                          ▼
                        </span>
                      </div>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick && onRowClick(row)}
                  //*Mantienes tus clases base y añades rowClassName(row.original) si existe
                  className={`cursor-pointer transition-colors ${rowClassName ? rowClassName(row.original) : 'hover:bg-slate-50'
                    }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap px-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* SECCIÓN FIJA: Paginación (Sticky bottom) */}
      <div className="sticky bottom-0 z-30 bg-white flex items-center justify-end space-x-2 py-2 border-t">
        <div className="flex-1 text-sm text-muted-foreground pl-2">
          Página {table.getState().pagination.pageIndex + 1} de{' '}
          {table.getPageCount()}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>
      <div className="text-sm text-gray-500 flex items-center justify-end pr-2 py-2">
        {table.getFilteredRowModel().rows.length} registros
      </div>
    </div>
  );
};

export default DataTable;