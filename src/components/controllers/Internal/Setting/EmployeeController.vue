<template>
    <ViewEmployee :employees="employees" :pagination="pagination" @index="indexEmployee"
        :showIndexEmployee="showIndexEmployee" @setting="settingEmployee" @submitUserFind="submitUserFind"
        :showSettingEmployee="showSettingEmployee" @submitPermissionAll="submitPermissionAll"
        @submitEmployeeFind="submitEmployeeFind" @submitSubmoduleAll="submitSubmoduleAll" :modules="modules"
        :submodules="submodules" :permissions="permissions" :modelUser="modelUser" @submitUserToggle="submitUserToggle"
        :modelEmployee="modelEmployee" :loadingIndex="loadingIndex" />
</template>
<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

import ViewEmployee from '@/components/templates/Internal/Setting/Employee/Employee.vue';

import ModelUser from '@/models/User';
import ModelEmployee from '@/models/Employee';

import EmployeeService from '@/services/EmployeeService';
import UserService from '@/services/UserService';
import ModuleService from '@/services/ModuleService';
import SubmoduleService from '@/services/SubmoduleService';
import PermissionService from '@/services/PermissionService';

import { useAlertStore } from '@/stores/alertStore';
import { useSwalStore } from '@/stores/swalStore';

const alertStore = useAlertStore();
const swalStore = useSwalStore();

const modelUser = ref(new ModelUser());
const modelEmployee = ref(new ModelEmployee());

const employees = ref([]);
const modules = ref([]);
const submodules = ref([]);
const permissions = ref([]);

const showIndexEmployee = ref(true);
const showSettingEmployee = ref(false);

const loadingIndex = ref(false);

const pagination = reactive({
    search: '',
    sizes: [5, 10, 25, 50, 100],
    per_page: 10,
    mode: 'grid',
    total: 0,
    count: 0,
    current_page: 1,
    total_pages: 0
})

const submitEmployeeAll = async () => {
    loadingIndex.value = true;
    try {
        const response = await EmployeeService.all(pagination.current_page, pagination.search, pagination.per_page);
        employees.value = response.data.employees;

        pagination.current_page = response.data.meta.pagination.current_page;
        pagination.per_page = response.data.meta.pagination.per_page;
        pagination.total = response.data.meta.pagination.total;
        pagination.count = response.data.meta.pagination.count;
        pagination.total_pages = response.data.meta.pagination.total_pages;
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    } finally {
        loadingIndex.value = false;
    }
};

const submitModuleAll = async () => {
    try {
        const response = await ModuleService.all(1, '', null, 'Interno');
        modules.value = response.data.modules;
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitSubmoduleAll = async (moduleId) => {
    permissions.value = [];
    try {
        const response = await SubmoduleService.all(moduleId);
        submodules.value = response.data.submodules;
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitPermissionAll = async ([roleId, permissionId]) => {
    if (!roleId && !permissionId) { permissions.value = []; return; }
    try {
        const response = await PermissionService.all(1, '', null, roleId, permissionId);
        permissions.value = response.data.permissions;
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const submitUserFind = async (employeeId) => {
    try {
        const response = await UserService.find(null, null, employeeId);
        modelUser.value.id = response.data.user.id;
        modelUser.value.person_id = response.data.user.person_id;
        modelUser.value.password = response.data.user.password;
        modelUser.value.relationships = response.data.user.relationships;
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
}

const submitEmployeeFind = async (employeeId) => {
    try {
        const response = await EmployeeService.find(employeeId);
        modelEmployee.value.id = response.data.employee.id;
        modelEmployee.value.person_id = response.data.employee.person_id;
        modelEmployee.value.headquarter_id = response.data.employee.headquarter_id;
        modelEmployee.value.position_id = response.data.employee.position_id;
        modelEmployee.value.start_date = response.data.employee.start_date;
        modelEmployee.value.end_date = response.data.employee.end_date;
        modelEmployee.value.relationships = response.data.employee.relationships;
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
}

const submitUserToggle = async (permissionId) => {
    try {
        modelUser.value.permission_id = permissionId;
        const response = await UserService.toggle(modelUser.value.id, modelUser.value);
        modelUser.value.relationships = response.data.user.relationships;
    } catch (error) {
        if (error.errors) {
            Object.entries(error.errors).forEach(([field, messages]) => {
                messages.forEach((message) => {
                    alertStore.addAlert({ title: error.attributes[field], message: message, type: 'warning' });
                });
            });
        } else {
            alertStore.addAlert({ title: 'Acceso Denegado', message: error?.error?.error || 'Ocurrió un error inesperado.', type: 'danger' });
        }
    }
};

const indexEmployee = () => {
    showIndexEmployee.value = true;
    showSettingEmployee.value = false;
}

const settingEmployee = () => {
    showIndexEmployee.value = false;
    showSettingEmployee.value = true;
    submodules.value = [];
    permissions.value = [];
    submitModuleAll();
}

onMounted(() => {
    submitEmployeeAll();
})

watch(() => pagination.current_page, () => {
    submitEmployeeAll();
});

watch(() => pagination.search, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitEmployeeAll();
    }
});

watch(() => pagination.per_page, () => {
    if (pagination.current_page !== 1) {
        pagination.current_page = 1;
    } else {
        submitEmployeeAll();
    }
});
</script>