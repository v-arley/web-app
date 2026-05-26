import { Response as Respuesta, type BackendResponse, type BackendListPayload } from "../shared/utils/Response";
import { Rule, type CreateRule, type UpdateRule } from "../models/Rule";
import { AxiosBaseService } from "../shared/utils/AxiosBaseService";

export class RuleService extends AxiosBaseService {

	async save(register: CreateRule): Promise<Respuesta> {
		try {
			const { data } = await this.client.post<BackendResponse<{ item: Rule }> | Rule>("/camp-rules", register);
			const rule = this.extractItem<Rule>(data);

			return new Respuesta(true, "Regla creada correctamente.", "", "registro", rule);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo crear la regla"), "", "registro", null);
		}
	}

	async update(id: number, register: UpdateRule): Promise<Respuesta> {
		try {
			const { data } = await this.client.put<BackendResponse<{ item: Rule }> | Rule>(`/camp-rules/${id}`, register);
			const rule = this.extractItem<Rule>(data);

			return new Respuesta(true, "Regla actualizada correctamente.", "", "registro", rule);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo actualizar la regla"), "", "registro", null);
		}
	}

	async remove(id: number): Promise<Respuesta> {
		try {
			await this.client.delete(`/camp-rules/${id}`);

			return new Respuesta(true, "Regla eliminada correctamente.", "", "registro", null);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo eliminar la regla"), "", "registro", null);
		}
	}

	async findAll(): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<BackendListPayload<Rule>> | Rule[]>("/camp-rules");
			const rules = this.extractItems<Rule>(data).map((rule) => new Rule(rule));

			return new Respuesta(true, "Reglas obtenidas correctamente.", "", "registros", rules);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudieron obtener las reglas"), "");
		}
	}

	async findById(id: number): Promise<Respuesta> {
		try {
			const { data } = await this.client.get<BackendResponse<{ item: Rule }> | Rule>(`/camp-rules/${id}`);
			const ruleData = this.extractItem<Rule>(data);
			const rule = ruleData ? new Rule(ruleData) : null;

			return new Respuesta(true, "Regla obtenida correctamente.", "", "registro", rule);
		} catch (error) {
			return new Respuesta(false, this.extractErrorMessage(error, "No se pudo obtener la regla"), "", "registro", null);
		}
	}
}

