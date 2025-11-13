export function getInitials(name: string | undefined): string {
  if (!name) return '';

  const completeName = name.split(' ');
  const firstName = completeName[0];

  if (completeName.length === 1) {
    return firstName.charAt(0);
  }

  if (completeName.length > 2) {
    const lastName = completeName[completeName.length - 1];

    const initials = firstName.charAt(0) + lastName.charAt(0);
    return initials.toUpperCase();
  }

  return (firstName.charAt(0) + completeName[1].charAt(0)).toUpperCase();
}
