interface EmptyStateProps {
    hasSearch: boolean;
  }
  
  export function EmptyState({ hasSearch }: EmptyStateProps) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
        <div className="text-6xl mb-4">
          {hasSearch ? '🔍' : '📭'}
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          {hasSearch ? 'No matches found' : 'No contacts available'}
        </h3>
        <p className="text-slate-600">
          {hasSearch 
            ? 'Try adjusting your search or filters'
            : 'Contacts will appear here once loaded'
          }
        </p>
      </div>
    );
}