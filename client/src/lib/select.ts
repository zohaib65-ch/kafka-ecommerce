export type SelectOption<T = string | number> = { value: T; label: string };

type Named = { _id: string; name: string };

export const formatSelectOptions = (
  data?: Named[] | false | null,
  empty = false
): SelectOption[] => {
  const options: SelectOption[] = [];

  if (data && data.length > 0) {
    data.forEach(option => {
      options.push({ value: option._id, label: option.name });
    });
  }

  if (empty) {
    options.unshift({ value: 0, label: 'No option selected' });
  }

  return options;
};
