import { IReqClaimExam } from '@afx/interfaces/payment/payment.iface';
import { endpoint, services } from '@afx/utils/config.endpoint';
import request from '@afx/utils/request.util';

export function ClaimExam(data: IReqClaimExam) {
    request<any>({
        url: endpoint.payment.claim,
        service: services.paymentService,
        data,
        method: 'POST',
        bodyType: 'formData'
    })
}