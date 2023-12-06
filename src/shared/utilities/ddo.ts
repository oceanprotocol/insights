import { Asset, DDO, Service } from '@oceanprotocol/lib';

export function getServiceByName(
  ddo: Asset | DDO,
  name: 'access' | 'compute'
): Service {
  if (!ddo) return;

  const service = ddo.services.filter((service) => service.type === name)[0];
  return service;
}
