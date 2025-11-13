import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type InputProps = {
  items: string[];
  placeholder: string;
  onChange?: (value: string) => void;
};

function SelectInput({ items, placeholder, onChange }: InputProps) {
  return (
    <Select onValueChange={(value) => onChange?.(value)}>
      <SelectTrigger className="w-full cursor-pointer bg-white">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-60 overflow-y-auto">
        <SelectGroup>

          {items.length === 0 ? (
            <SelectItem value="invalido" disabled>
              Nenhum horário disponível
            </SelectItem>
          ) : (
            items.map((item) => (
              <SelectItem key={item} value={item} className="cursor-pointer">
                {item}
              </SelectItem>
            ))
          )}
          
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SelectInput;
