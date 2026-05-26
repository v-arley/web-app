// components/SearchBar.jsx
export default function SearchBar({
    search,
    setSearch,
    filterField,
    setFilterField
}) {
    return (
        <div className="card toolbar">
            <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
            />

            <select
                value={filterField}
                onChange={(e) =>
                    setFilterField(e.target.value)
                }
            >
                <option value="all">All Fields</option>
                <option value="id">ID</option>
                <option value="dni">DNI</option>
                <option value="name">Name</option>
                <option value="surname">Surname</option>
                <option value="phone">Phone</option>
                <option value="email">Email</option>
            </select>
        </div>
    );
}