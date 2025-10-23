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
  
  export function UserCard({ user }: { user: User }) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-slate-900 mb-1 truncate">
              {user.name}
            </h3>
            <p className="text-sm text-slate-600 truncate">{user.company.name}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0 ml-3">
            {user.name.charAt(0)}
          </div>
        </div>
  
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <span className="text-slate-400 w-5 flex-shrink-0">📧</span>
            <a 
              href={`mailto:${user.email}`}
              className="text-blue-600 hover:underline ml-2 truncate"
            >
              {user.email}
            </a>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-slate-400 w-5 flex-shrink-0">📞</span>
            <a 
              href={`tel:${user.phone}`}
              className="text-slate-700 ml-2 hover:text-blue-600"
            >
              {user.phone}
            </a>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-slate-400 w-5 flex-shrink-0">🌐</span>
            <a 
              href={`https://${user.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline ml-2 truncate"
            >
              {user.website}
            </a>
          </div>
          <div className="flex items-start text-sm">
            <span className="text-slate-400 w-5 flex-shrink-0 mt-0.5">📍</span>
            <span className="text-slate-700 ml-2 text-xs leading-relaxed">
              {user.address.city}, {user.address.zipcode}
            </span>
          </div>
        </div>
  
        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 italic line-clamp-2">
            &quot;{user.company.catchPhrase}&quot;
          </p>
        </div>
      </div>
    );
  }