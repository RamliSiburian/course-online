import { endpoint, services } from '@afx/utils/config.endpoint';
import request from '@afx/utils/request.util';

export function GetListMenu() {
    return request<any>({
        url: endpoint.client.user.menu.listMenu,
        method: 'GET',
        service: services.userService
    })
}