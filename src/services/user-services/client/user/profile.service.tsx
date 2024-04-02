import { endpoint, services } from '@afx/utils/config.endpoint';
import request from '@afx/utils/request.util';

export function GetSimpleProfile() {
    return request<any>({
        url: endpoint.client.user.profile.simpleProfile,
        method: 'GET',
        service: services.userService
    })
}