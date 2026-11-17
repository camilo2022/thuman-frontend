import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore(
  "authStore",
  () => {
    const personId = ref(null);
    const employeeId = ref(null);
    const name = ref(null);
    const userId = ref(null);
    const token = ref(null);
    const favorites = ref([]);
    const follows = ref([]);
    const photo = ref(null);
    const emailVerifiedAt = ref(null);
    const phoneNumberVerifiedAt = ref(null);

    //Validaciones de permisos
    const roles = ref([]);
    const permissions = ref([]);
    const authorizationLoaded = ref(false);

    const normalizeAuthorization = (items) => {
      if (!Array.isArray(items)) return [];

      return [
        ...new Set(
          items
            .map((item) => {
              if (typeof item === "string") return item;

              return item?.name ?? null;
            })
            .filter(Boolean),
        ),
      ];
    };

    const setAuth = (authData) => {
      personId.value = authData?.personId ?? personId.value;
      employeeId.value = authData?.employeeId ?? employeeId.value;
      name.value = authData?.name ?? name.value;
      userId.value = authData?.userId ?? userId.value;
      token.value = authData?.token ?? token.value;
      favorites.value = authData?.favorites ?? favorites.value;
      follows.value = authData?.follows ?? follows.value;
      photo.value = authData?.photo ?? photo.value;
      if (authData?.emailVerifiedAt !== undefined)
        emailVerifiedAt.value = authData.emailVerifiedAt;
      if (authData?.phoneNumberVerifiedAt !== undefined)
        phoneNumberVerifiedAt.value = authData.phoneNumberVerifiedAt;
      if (authData?.roles !== undefined)
        roles.value = normalizeAuthorization(authData.roles);
      if (authData?.permissions !== undefined)
        permissions.value = normalizeAuthorization(authData.permissions);
      if (
        authData?.roles !== undefined ||
        authData?.permissions !== undefined
      ) {
        authorizationLoaded.value = true;
      }
    };

    const getAuth = computed(() => ({
      personId: personId.value,
      employeeId: employeeId.value,
      name: name.value,
      userId: userId.value,
      token: token.value,
      favorites: favorites.value,
      follows: follows.value,
      photo: photo.value,
      emailVerifiedAt: emailVerifiedAt.value,
      phoneNumberVerifiedAt: phoneNumberVerifiedAt.value,
      roles: roles.value,
      permissions: permissions.value,
      authorizationLoaded: authorizationLoaded.value,
    }));

    const hasPermission = (permissionName) => {
      if (!permissionName) return false;

      return permissions.value.includes(permissionName);
    };

    const hasAnyPermission = (permissionNames) => {
      if (!Array.isArray(permissionNames)) return false;
      return permissionNames.some((permissionName) =>
        hasPermission(permissionName),
      );
    };

    const hasAllPermissions = (permissionNames) => {
      if (!Array.isArray(permissionNames)) return false;

      return permissionNames.every((permissionName) =>
        hasPermission(permissionName),
      );
    };

    const hasRole = (roleName) => {
      if (!roleName) return false;

      return roles.value.includes(roleName);
    };

    const hasAnyRole = (roleNames) => {
      if (!Array.isArray(roleNames)) return false;

      return roleNames.some((roleName) => hasRole(roleName));
    };

    const clearAuth = () => {
      personId.value = null;
      employeeId.value = null;
      name.value = null;
      userId.value = null;
      token.value = null;
      favorites.value = [];
      follows.value = [];
      photo.value = null;
      emailVerifiedAt.value = null;
      phoneNumberVerifiedAt.value = null;

      roles.value = [];
      permissions.value = [];
      authorizationLoaded.value = false;

      sessionStorage.removeItem("authStore");
    };

    const isAuthenticated = computed(() => !!token.value);

    const isVerified = computed(
      () =>
        Boolean(emailVerifiedAt.value) && Boolean(phoneNumberVerifiedAt.value),
    );

    return {
      personId,
      employeeId,
      name,
      userId,
      token,
      favorites,
      follows,
      photo,
      emailVerifiedAt,
      phoneNumberVerifiedAt,

      roles,
      permissions,
      authorizationLoaded,

      setAuth,
      getAuth,
      clearAuth,

      isAuthenticated,
      isVerified,

      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      hasRole,
      hasAnyRole,
    };
  },
  {
    persist: {
      storage: sessionStorage,
    },
  },
);
