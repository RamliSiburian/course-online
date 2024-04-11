import { IReqAddPackages } from '@afx/interfaces/bimbel/rest/tutoring-packages/package.iface';
import { endpoint, services } from '@afx/utils/config.endpoint';
import request from '@afx/utils/request.util';

export function GetListPackages() {
    return request<any>({
        url: endpoint.bimbel.rest.tutoringPackages.listPackages,
        method: 'GET',
        service: services.bimbelService
    })
}
export function GetPackageDetail(id: string) {
    return request<any>({
        url: `${endpoint.bimbel.rest.tutoringPackages.packageDetail}/${id}`,
        method: 'GET',
        service: services.bimbelService
    })
}
export function AddPackage(data: IReqAddPackages) {
    return request<any>({
        url: endpoint.bimbel.rest.tutoringPackages.addPackage,
        method: 'POST',
        data,
        service: services.bimbelService
    })
}
export function UpdatePackage(data: IReqAddPackages, id: string) {
    return request<any>({
        url: `${endpoint.bimbel.rest.tutoringPackages.updatePackage}/${id}`,
        method: 'PATCH',
        data,
        service: services.bimbelService
    })
}

export function DeletePackage(id: string) {
    return request<any>({
        url: `${endpoint.bimbel.rest.tutoringPackages.deletePackage}/${id}`,
        method: 'DELETE',
        service: services.bimbelService
    })
}