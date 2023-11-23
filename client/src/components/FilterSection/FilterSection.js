function FilterSection({
  title,
  filters,
  error,
  activeFilter,
  onFilterChange,
}) {
  return (
    <>
      <p className="filter-title">{title}</p>
      <div className="filter-data">
        {error ? (
          <p>{`Cannot load ${title.toLowerCase()} filters.`}</p>
        ) : (
          filters.length > 0 &&
          filters.map((filter) => (
            <span key={filter.id} className="filter-item">
              <label htmlFor={filter.id}>{filter.name}</label>
              <input
                className="filter-checkbox"
                id={filter.id}
                type="checkbox"
                checked={activeFilter.includes(filter.id)}
                onChange={() => onFilterChange(filter.id)}
              />
            </span>
          ))
        )}
      </div>
    </>
  );
}

export default FilterSection;
