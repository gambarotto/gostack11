import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { day, month, year } = request.query;

    const listProviderDayAvailability = container.resolve(
      ListProviderDayAvailabilityService,
    );

    const providers = await listProviderDayAvailability.execute({
      day: Number(day),
      month: Number(month),
      year: Number(year),
      provider_id,
    });
    return response.json(providers);
  }
}
export default ProviderDayAvailabilityController;
