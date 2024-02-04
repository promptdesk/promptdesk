export default function DropDown({
  label,
  options,
  selected,
  onChange,
  id,
}: {
  label?: string;
  options: any[];
  selected: any;
  onChange: any;
  id: string;
}) {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      var value = e.target.value as any
      if(e.target.value === 'none') {
        value = undefined;
      }
      onChange(value);
    } else {
      
    }
  };

  if (options.length > 0 && (typeof options[0] === 'string' || typeof options[0] === 'number')) {
    options = options.map((option) => ({ value: option, name: option }));
  }

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label}
        </label>
      )}
      <div className="grid">
        <svg className="pointer-events-none z-10 right-1 relative col-start-1 row-start-1 h-4 w-4 self-center justify-self-end forced-colors:hidden" viewBox="0 0 16 16" fill="currentColor">
          <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path>
        </svg>
        <select
          id={id}
          name="location"
          className="block appearance-none row-start-1 col-start-1 w-full rounded-md py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={handleSelectChange}
          value={selected}
          >
          {options.map((option, index) => (
            <option
            key={index}
            value={option.value === undefined ? 'none' : option.value}
            >
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}