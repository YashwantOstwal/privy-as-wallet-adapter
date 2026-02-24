export function truncateAddress(addressAsBase58String: string) {
  return (
    addressAsBase58String.slice(0, 4) + "..." + addressAsBase58String.slice(-4)
  );
}
