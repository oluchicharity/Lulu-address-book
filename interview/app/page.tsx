'use client';

import { useState, useMemo, useCallback } from 'react';
import { trpc } from './trpc/client';
import { UserCard } from './components/UserCard';
import { SearchBar } from './components/SearchBar';
import { FilterControls } from './components/FilterControls';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { EmptyState } from './components/EmptyState';

type SortField = 'name' | 'email' | 'company';
type SortDirection = 'asc' | 'desc';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
  };
  address: {
    street: string;
    city: string;
    zipcode: string;
  };
}

export default function AddressBook() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [companyFilter, setCompanyFilter] = useState<string>('all');

  const { data: users, isLoading, error, refetch } = trpc.users.getAll.useQuery(
    undefined,
    {
      staleTime: 5 * 60 * 1000,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    }
  );

  const companies = useMemo((): string[] => {
    if (!users) return [];
    const uniqueCompanies = [...new Set(users.map((u: User) => u.company.name))];
    return uniqueCompanies.sort() as string[];
  }, [users]);

  const filteredAndSortedUsers = useMemo(() => {
    if (!users) return [];

    let result = [...users];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((user: User) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.company.name.toLowerCase().includes(query) ||
        user.phone.includes(query)
      );
    }

    if (companyFilter !== 'all') {
      result = result.filter((user: User) => user.company.name === companyFilter);
    }

    result.sort((a: User, b: User) => {
      let aVal: string, bVal: string;

      switch (sortField) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'email':
          aVal = a.email.toLowerCase();
          bVal = b.email.toLowerCase();
          break;
        case 'company':
          aVal = a.company.name.toLowerCase();
          bVal = b.company.name.toLowerCase();
          break;
      }

      const comparison = aVal.localeCompare(bVal);
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [users, searchQuery, sortField, sortDirection, companyFilter]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleSortChange = useCallback((field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error.message} onRetry={() => refetch()} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Address Book
          </h1>
          <p className="text-slate-600">
            {users?.length || 0} contacts • {filteredAndSortedUsers.length} showing
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <SearchBar 
            value={searchQuery} 
            onChange={handleSearchChange}
            placeholder="Search by name, email, company, or phone..."
          />
          
          <FilterControls
            sortField={sortField}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            companyFilter={companyFilter}
            onCompanyFilterChange={setCompanyFilter}
            companies={companies}
          />
        </div>

        {filteredAndSortedUsers.length === 0 ? (
          <EmptyState hasSearch={!!searchQuery || companyFilter !== 'all'} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedUsers.map((user: User) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}