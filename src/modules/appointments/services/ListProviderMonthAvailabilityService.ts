import { getDaysInMonth, getDate } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}
type IResponse = Array<{
  day: number;
  available: boolean;
}>;
@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    // Recupera tds os agendamentos em um mes de um prestador
    const monthAppointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        month,
        year,
      },
    );
    // Obtem qtos dias hà no mes passado como parâmetro
    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));
    // Cria um array com o tamanho da qtd de dias no mes -> [1,2,3,....,30]
    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );
    // Percorre o array criado
    const availables = eachDayArray.map(day => {
      // Add na variavel 'appointmentsInDay' os agendamentos do dia correspondente
      const appointmentsInDay = monthAppointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });
      // Retorna um obj no formato esperado
      return {
        day,
        // como os agendamentos só serão permitidos das 08 às 17,
        // somente 10 agendamentos serão possíveis por dia,
        // por isso 'appointmentsInDay.length < 10'
        available: appointmentsInDay.length < 10,
      };
    });

    return availables;
  }
}
export default ListProviderMonthAvailabilityService;
