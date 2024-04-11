import { IReqPurchasing, IReqUpdatePurchase } from '@afx/interfaces/bimbel/rpc/purchase/purchase.iface';
import { endpoint, services } from '@afx/utils/config.endpoint';
import request from '@afx/utils/request.util';

export function GetListPurchase() {
    return request<any>({
        url: endpoint.bimbel.rpc.purchase.purchaseList,
        method: 'GET',
        service: services.bimbelService
    })
}

export function Purchasing(data: IReqPurchasing) {
    return request<any>({
        url: endpoint.bimbel.rpc.purchase.purchase,
        method: 'POST',
        data,
        service: services.bimbelService
    })
}
export function GetPurchaseDetail(id: string) {
    return request<any>({
        url: `${endpoint.bimbel.rpc.purchase.purchaseDetail}/${id}`,
        method: 'GET',
        service: services.bimbelService
    })
}
export function VerifyingPurchase(data: IReqUpdatePurchase) {
    return request<any>({
        url: endpoint.bimbel.rpc.purchase.purchaseVerifying,
        method: 'PATCH',
        data,
        service: services.bimbelService
    })
}
export function VerifiedPurchase(data: IReqUpdatePurchase) {
    return request<any>({
        url: endpoint.bimbel.rpc.purchase.purchaseVerified,
        method: 'PATCH',
        data,
        service: services.bimbelService
    })
}
export function CancelPurchase(data: IReqUpdatePurchase) {
    return request<any>({
        url: endpoint.bimbel.rpc.purchase.purchaseCancel,
        method: 'PATCH',
        data,
        service: services.bimbelService
    })
}