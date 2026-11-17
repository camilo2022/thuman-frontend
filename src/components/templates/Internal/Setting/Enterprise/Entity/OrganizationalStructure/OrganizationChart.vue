<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { OrgChart } from 'd3-org-chart'

const emit = defineEmits(['index']);

const chartContainer = ref(null)

const colaboradores = [
    {
        id: 'gerencia-general',
        parentId: null,
        nombre: 'María González',
        cargo: 'Gerente General',
        area: 'Gerencia General',
        foto: 'https://i.pravatar.cc/150?img=47'
    },
    {
        id: 'gerencia-servicios',
        parentId: 'gerencia-general',
        nombre: 'David Ramírez',
        cargo: 'Gerente de Servicios',
        area: 'Gerencia de Servicios',
        foto: 'https://i.pravatar.cc/150?img=12'
    },
    {
        id: 'jefe-operaciones',
        parentId: 'gerencia-servicios',
        nombre: 'Carlos Rodríguez',
        cargo: 'Jefe de Operaciones',
        area: 'Operaciones',
        foto: 'https://i.pravatar.cc/150?img=68'
    },
    {
        id: 'jefe-talento-humano',
        parentId: 'gerencia-general',
        nombre: 'Laura Pérez',
        cargo: 'Jefe de Talento Humano',
        area: 'Talento Humano',
        foto: 'https://i.pravatar.cc/150?img=45'
    },
    {
        id: 'coordinador-claro',
        parentId: 'jefe-operaciones',
        nombre: 'Andrés Díaz',
        cargo: 'Coordinador',
        area: 'Campaña Claro',
        foto: 'https://i.pravatar.cc/150?img=11'
    },
    {
        id: 'coordinador-movistar',
        parentId: 'jefe-operaciones',
        nombre: 'Natalia Rojas',
        cargo: 'Coordinadora',
        area: 'Campaña Movistar',
        foto: 'https://i.pravatar.cc/150?img=49'
    },
    {
        id: 'coordinador-pycca',
        parentId: 'jefe-operaciones',
        nombre: 'Felipe Torres',
        cargo: 'Coordinador',
        area: 'Campaña Pycca',
        foto: 'https://i.pravatar.cc/150?img=33'
    },
    {
        id: 'supervisor-claro-1',
        parentId: 'coordinador-claro',
        nombre: 'Paola Medina',
        cargo: 'Supervisor',
        area: 'Campaña Claro',
        foto: 'https://i.pravatar.cc/150?img=32'
    },
    {
        id: 'supervisor-claro-2',
        parentId: 'coordinador-claro',
        nombre: 'Jorge Silva',
        cargo: 'Supervisor',
        area: 'Campaña Claro',
        foto: 'https://i.pravatar.cc/150?img=13'
    },
    {
        id: 'asesor-1',
        parentId: 'supervisor-claro-1',
        nombre: 'Sofía Martínez',
        cargo: 'Asesora',
        area: 'Campaña Claro',
        foto: 'https://i.pravatar.cc/150?img=47',
        esUsuarioActual: true
    },
    {
        id: 'asesor-2',
        parentId: 'supervisor-claro-1',
        nombre: 'Camilo Herrera',
        cargo: 'Asesor',
        area: 'Campaña Claro',
        foto: 'https://i.pravatar.cc/150?img=14'
    },
    {
        id: 'asesor-3',
        parentId: 'supervisor-claro-1',
        nombre: 'Valentina Castro',
        cargo: 'Asesora',
        area: 'Campaña Claro',
        foto: 'https://i.pravatar.cc/150?img=44'
    },
    {
        id: 'asesor-4',
        parentId: 'supervisor-claro-2',
        nombre: 'Daniel Moreno',
        cargo: 'Asesor',
        area: 'Campaña Claro',
        foto: 'https://i.pravatar.cc/150?img=15'
    },
    {
        id: 'asesor-5',
        parentId: 'supervisor-claro-2',
        nombre: 'Karla Ruiz',
        cargo: 'Asesora',
        area: 'Campaña Claro',
        foto: 'https://i.pravatar.cc/150?img=48'
    },
    {
        id: 'asesor-movistar-1',
        parentId: 'coordinador-movistar',
        nombre: 'Miguel Sánchez',
        cargo: 'Asesor',
        area: 'Campaña Movistar',
        foto: 'https://i.pravatar.cc/150?img=69'
    },
    {
        id: 'asesor-movistar-2',
        parentId: 'coordinador-movistar',
        nombre: 'Diana Vega',
        cargo: 'Asesora',
        area: 'Campaña Movistar',
        foto: 'https://i.pravatar.cc/150?img=46'
    },
    {
        id: 'analista-th',
        parentId: 'jefe-talento-humano',
        nombre: 'Sandra López',
        cargo: 'Analista de Talento Humano',
        area: 'Talento Humano',
        foto: 'https://i.pravatar.cc/150?img=25'
    }
]

onMounted(async () => {
    await nextTick()

    if (!chartContainer.value) {
        console.error('No se encontró el contenedor del organigrama')
        return
    }

    const chart = new OrgChart()


    chart
        .container(chartContainer.value)
        .data(colaboradores)
        .nodeId((d) => d.id)
        .parentNodeId((d) => d.parentId)
        .nodeWidth(() => 250)
        .nodeHeight(() => 120)
        .childrenMargin(() => 50)
        .nodeContent((d) => {
            const soyYo = d.data.esUsuarioActual
            const borde = soyYo ? '#22c55e' : '#dce3ee'

            return `
        <div style="
            box-sizing: border-box;
            width: 250px;
            height: 120px;
            display: flex;
            align-items: center;
            gap: 12px;
            background: white;
            border: 2px solid ${borde};
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,.10);
            padding: 14px;
            font-family: Arial, sans-serif;
        ">
            <img
                src="${d.data.foto || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(d.data.nombre)}"
                alt="${d.data.nombre}"
                style="
                    width: 54px;
                    height: 54px;
                    min-width: 54px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid ${soyYo ? '#22c55e' : '#5b4cd0'};
                "
            />

            <div style="min-width: 0;">
                <div style="font-size:16px;font-weight:700;color:#1f2937;">
                    ${d.data.nombre}
                </div>

                <div style="font-size:13px;color:#2563eb;margin-top:6px;">
                    ${d.data.cargo}
                </div>

                ${soyYo ? `
                    <div style="
                        display: inline-block;
                        margin-top: 7px;
                        padding: 3px 8px;
                        background: #dcfce7;
                        color: #15803d;
                        border-radius: 20px;
                        font-size: 11px;
                        font-weight: 700;
                    ">Tú</div>
                ` : ''}
            </div>
        </div>
    `
        })
        .render()
        .fit()
})
</script>

<template>
    <div class="breadcrumb">
        <button type="button" class="crumb-back" @click="emit('index')">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#5b4cd0" viewBox="0 0 256 256">
                <path
                    d="M228,128a12,12,0,0,1-12,12H69l51.52,51.51a12,12,0,0,1-17,17l-72-72a12,12,0,0,1,0-17l72-72a12,12,0,0,1,17,17L69,116H216A12,12,0,0,1,228,128Z">
                </path>
            </svg>
            <p>Volver</p>
        </button>
        <span>|</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#5b4cd0" viewBox="0 0 256 256">
            <path
                d="M222.14,105.85l-80-80a20,20,0,0,0-28.28,0l-80,80A19.86,19.86,0,0,0,28,120v96a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V164h24v52a12,12,0,0,0,12,12h64a12,12,0,0,0,12-12V120A19.86,19.86,0,0,0,222.14,105.85ZM204,204H164V152a12,12,0,0,0-12-12H104a12,12,0,0,0-12,12v52H52V121.65l76-76,76,76Z">
            </path>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path
                d="M7.31754 7.44205L1.06754 13.692C1.00947 13.7501 0.940528 13.7962 0.864658 13.8276C0.788787 13.859 0.707469 13.8752 0.625347 13.8752C0.543226 13.8752 0.461908 13.859 0.386037 13.8276C0.310167 13.7962 0.241229 13.7501 0.18316 13.692C0.125091 13.634 0.0790281 13.565 0.0476015 13.4892C0.0161748 13.4133 0 13.332 0 13.2499C0 13.1677 0.0161748 13.0864 0.0476015 13.0105C0.0790281 12.9347 0.125091 12.8657 0.18316 12.8077L5.99175 6.99986L0.18316 1.19205C0.0658843 1.07477 -1.2357e-09 0.915712 0 0.749859C1.2357e-09 0.584007 0.0658843 0.424947 0.18316 0.307672C0.300435 0.190396 0.459495 0.124512 0.625347 0.124512C0.7912 0.124512 0.95026 0.190396 1.06754 0.307672L7.31754 6.55767C7.37565 6.61572 7.42175 6.68465 7.4532 6.76052C7.48465 6.8364 7.50084 6.91772 7.50084 6.99986C7.50084 7.08199 7.48465 7.16332 7.4532 7.2392C7.42175 7.31507 7.37565 7.384 7.31754 7.44205Z"
                fill="#5B4CD0" />
        </svg>
        <span>Configuración</span>
        <span>|</span>
        <span>Empresa</span>
        <span>|</span>
        <span>Entidad internacional</span>
        <span>|</span>
        <span class="active">Organigrama</span>
    </div>

    <div class="container-data">
        <div class="main-container">
            <!-- TÍTULO -->
            <h2 class="titulo">Organigrama</h2>
            <div ref="chartContainer" class="chart-container"></div>
        </div>
    </div>

</template>

<style scoped>
.organigrama {
    padding: 24px;
}

.chart-container {
    width: 100%;
    min-height: 700px;
    overflow: auto;
    background: #f8fafc;
    border-radius: 12px;
}
</style>