// assets
import { IconSchool } from '@tabler/icons-react';

// constant
const icons = {
    IconSchool
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages2 = {
    id: 'students',
    title: 'Estudiantes',
    icon: icons.IconSchool,
    type: 'group',
    children: [
        {
            id: 'studentes_registration',
            title: 'Estudiantes',
            type: 'collapse',
            icon: icons.IconSchool,
            breadcrumbs: false,
            children: [
                {
                    id: 'user_active',
                    title: 'Usuarios',
                    type: 'item',
                    url: '/usuarios',
                    breadcrumbs: false
                },
                {
                    id: 'history',
                    title: 'Historial',
                    type: 'item',
                    url: '/historial',
                    breadcrumbs: false
                }
            ]
        }
    ]
};

export default pages2;
