const Stats: React.FC<any> = ({
    stats
  }) => {
    return (
        <div>
        <dl className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {stats.map((item:any) => (
            <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-2 shadow sm:p-4">
                <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
                <dd className="mt-1 text-xl font-semibold tracking-tight text-gray-900">{item.stat}</dd>
            </div>
            ))}
        </dl>
        </div>
    )
}

export default Stats;