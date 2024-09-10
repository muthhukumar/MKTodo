interface SelectOptionProps {
  item: string
  checked: boolean
  onChange: (item: string) => void
}

export default function SelectOption({item, checked, onChange}: SelectOptionProps) {
  return (
    <div key={item} className="flex items-center gap-3">
      <input
        type="checkbox"
        id={item}
        value={item}
        checked={checked}
        onChange={() => onChange(item)}
      />
      <label htmlFor={item} className="w-full">
        <p>{item}</p>
      </label>
    </div>
  )
}
