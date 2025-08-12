import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Search, Filter, MoreVertical } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { cn } from '@/lib/utils';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  mobileLabel?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface MobileDataTableProps {
  data: any[];
  columns: Column[];
  title?: string;
  searchable?: boolean;
  filterable?: boolean;
  onRowClick?: (row: any) => void;
  actions?: (row: any) => React.ReactNode;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export const MobileDataTable: React.FC<MobileDataTableProps> = ({
  data,
  columns,
  title,
  searchable = true,
  filterable = false,
  onRowClick,
  actions,
  loading = false,
  emptyMessage = "Aucune donnée disponible",
  className
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Filter and sort data
  const filteredData = data.filter(row =>
    searchTerm === '' || 
    columns.some(col => 
      String(row[col.key]).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = sortColumn 
    ? [...filteredData].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        const direction = sortDirection === 'asc' ? 1 : -1;
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return (aVal - bVal) * direction;
        }
        
        return String(aVal).localeCompare(String(bVal)) * direction;
      })
    : filteredData;

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const toggleRowExpansion = (rowId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowId)) {
      newExpanded.delete(rowId);
    } else {
      newExpanded.add(rowId);
    }
    setExpandedRows(newExpanded);
  };

  if (loading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Chargement...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      {(title || searchable || filterable) && (
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            {title && (
              <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
            )}
            
            {(searchable || filterable) && (
              <div className="flex flex-col sm:flex-row gap-2">
                {searchable && (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-64"
                      mobileOptimized={true}
                    />
                  </div>
                )}
                
                {filterable && (
                  <Button variant="outline" size="mobile" mobileOptimized={true}>
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrer
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>
      )}
      
      <CardContent className="p-0">
        {sortedData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block mobile-table-container">
              <table className="w-full mobile-table">
                <thead>
                  <tr className="border-b border-border">
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className={cn(
                          "px-4 py-3 text-left text-sm font-medium text-muted-foreground",
                          column.sortable && "cursor-pointer hover:text-foreground transition-colors"
                        )}
                        onClick={() => column.sortable && handleSort(column.key)}
                      >
                        <div className="flex items-center space-x-1">
                          <span>{column.label}</span>
                          {column.sortable && sortColumn === column.key && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              {sortDirection === 'asc' ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </motion.div>
                          )}
                        </div>
                      </th>
                    ))}
                    {actions && <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((row, index) => (
                    <motion.tr
                      key={row.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className={cn(
                        "border-b border-border hover:bg-accent/50 transition-colors",
                        onRowClick && "cursor-pointer"
                      )}
                      onClick={() => onRowClick?.(row)}
                    >
                      {columns.map((column) => (
                        <td key={column.key} className="px-4 py-3 text-sm">
                          {column.render ? column.render(row[column.key], row) : row[column.key]}
                        </td>
                      ))}
                      {actions && (
                        <td className="px-4 py-3 text-right">
                          {actions(row)}
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3 p-4">
              {sortedData.map((row, index) => (
                <motion.div
                  key={row.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="mobile-table-card bg-accent/20 hover:bg-accent/30 transition-all duration-200 cursor-pointer"
                  onClick={() => onRowClick?.(row)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-foreground">
                      {row[columns[0].key]}
                    </h4>
                    <div className="flex items-center space-x-2">
                      {actions && actions(row)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRowExpansion(row.id || index.toString());
                        }}
                        className="p-1"
                      >
                        {expandedRows.has(row.id || index.toString()) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {expandedRows.has(row.id || index.toString()) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2 pt-2 border-t border-border"
                      >
                        {columns.slice(1).map((column) => (
                          <div key={column.key} className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              {column.mobileLabel || column.label}:
                            </span>
                            <span className="text-sm font-medium">
                              {column.render ? column.render(row[column.key], row) : row[column.key]}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
