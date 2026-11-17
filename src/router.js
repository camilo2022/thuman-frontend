import { createRouter, createWebHistory } from "vue-router";
import AuthController from "@/components/controllers/LoginController.vue";
import Login from "@/components/templates/Login.vue";
import RegisterController from "@/components/controllers/RegisterController.vue";
import Register from "@/components/templates/Register.vue";
import RecoveryController from "@/components/controllers/RecoveryController.vue";
import Recovery from "@/components/templates/Recovery.vue";
import VerifyController from "@/components/controllers/VerifyController.vue";
import Verify from "@/components/templates/Verify.vue";
import ChangeController from "@/components/controllers/ChangeController.vue";
import Change from "@/components/templates/Change.vue";
import ProfileController from "@/components/controllers/External/Private/ProfileController.vue";
import Profile from "@/components/templates/External/Private/Profile/Profile.vue";
import FavoriteController from "@/components/controllers/External/Private/FavoriteController.vue";
import Favorite from "@/components/templates/External/Private/Favorite/Favorite.vue";
import ApplicationController from "@/components/controllers/External/Private/ApplicationController.vue";
import Application from "@/components/templates/External/Private/Application/Application.vue";
import TestController from "@/components/controllers/TestController.vue";
import Test from "@/components/templates/Test.vue";
import Enterprise from "@/components/templates/Internal/Setting/Enterprise/Enterprise.vue";
import EnterpriseController from "@/components/controllers/Internal/Setting/EnterpriseController.vue";
import AreaController from "@/components/controllers/Internal/Setting/AreaController.vue";
import MaritalStatusController from "@/components/controllers/Internal/Setting/MaritalStatusController.vue";
import IndexMaritalStatus from "@/components/templates/Internal/Setting/MaritalStatus/Index.vue";
import PhoneValidationController from "@/components/controllers/Internal/Setting/PhoneValidationController.vue";
import AcademicLevelController from "@/components/controllers/Internal/Setting/AcademicLevelController.vue";
import PensionFundController from "@/components/controllers/Internal/Setting/PensionFundController.vue";
import EntityTypeController from "@/components/controllers/Internal/Setting/EntityTypeController.vue";
import IndexPersonnelRequisition from "@/components/templates/Internal/Recruitment/PersonnelRequisition/Index.vue";
import PersonnelRequisitionController from "@/components/controllers/Internal/Recruitment/PersonnelRequisitionController.vue";
import EpidemiologicalProgramController from "@/components/controllers/Internal/Setting/EpidemiologicalProgramController.vue";
import Area from "@/components/templates/Internal/Setting/Area/Area.vue";
import SkillController from "@/components/controllers/Internal/Setting/SkillController.vue";
import Skill from "@/components/templates/Internal/Setting/Skill/Skill.vue";
import BankController from "@/components/controllers/Internal/Setting/BankController.vue";
import Bank from "@/components/templates/Internal/Setting/Bank/Bank.vue";
import AcademicLevel from "@/components/templates/Internal/Setting/AcademicLevel/AcademicLevel.vue";
import BenefitController from "@/components/controllers/Internal/Setting/BenefitController.vue";
import Benefit from "@/components/templates/Internal/Setting/Benefit/Benefit.vue";
import EntityType from "@/components/templates/Internal/Setting/EntityType/EntityType.vue";
import CompensationFundController from "@/components/controllers/Internal/Setting/CompensationFundController.vue";
import CompensationFund from "@/components/templates/Internal/Setting/CompensationFund/CompensationFund.vue";
import EpidemiologicalProgram from "@/components/templates/Internal/Setting/EpidemiologicalProgram/EpidemiologicalProgram.vue";
import RiskManagerController from "@/components/controllers/Internal/Setting/RiskManagerController.vue";
import RiskManager from "@/components/templates/Internal/Setting/RiskManager/RiskManager.vue";
import PensionFund from "@/components/templates/Internal/Setting/PensionFund/PensionFund.vue";
import PhoneValidation from "@/components/templates/Internal/Setting/PhoneValidation/PhoneValidation.vue";
import HealthEntity from "@/components/templates/Internal/Setting/HealthEntity/HealthEntity.vue";
import HealthEntityController from "@/components/controllers/Internal/Setting/HealthEntityController.vue";
import ContractTypeController from "@/components/controllers/Internal/Setting/ContractTypeController.vue";
import ContractType from "@/components/templates/Internal/Setting/ContractType/ContractType.vue";
import WorkArrangementController from "@/components/controllers/Internal/Setting/WorkArrangementController.vue";
import WorkArrangement from "@/components/templates/Internal/Setting/WorkArrangement/WorkArrangement.vue";
import WorkDayController from "@/components/controllers/Internal/Setting/WorkDayController.vue";
import WorkDay from "@/components/templates/Internal/Setting/WorkDay/WorkDay.vue";
import DocumentTypeController from "@/components/controllers/Internal/Setting/DocumentTypeController.vue";
import DocumentType from "@/components/templates/Internal/Setting/DocumentType/DocumentType.vue";
import EntityController from "@/components/controllers/Internal/Setting/EntityController.vue";
import Entity from "@/components/templates/Internal/Setting/Enterprise/Entity/Entity.vue";
import PositionController from "@/components/controllers/Internal/Setting/PositionController.vue";
import Position from "@/components/templates/Internal/Setting/Position/Position.vue";
import GalleryController from "@/components/controllers/Internal/Setting/GalleryController.vue";
import Gallery from "@/components/templates/Internal/Setting/Enterprise/Entity/Gallery/Gallery.vue";
import HeadquarterController from "@/components/controllers/Internal/Setting/HeadquarterController.vue";
import Headquarter from "@/components/templates/Internal/Setting/Enterprise/Entity/Headquarter/Headquarter.vue";
import TemplateController from "@/components/controllers/Internal/Setting/TemplateController.vue";
import Template from "@/components/templates/Internal/Setting/Enterprise/Entity/Template/Template.vue";
import RecruitmentVacantController from "@/components/controllers/Internal/Recruitment/VacantController.vue";
import RecruimentVacant from "@/components/templates/Internal/Recruitment/Vacant/Vacant.vue";
import CandidateControlle from "@/components/controllers/Internal/Recruitment/CandidateController.vue";
import Candidate from "@/components/templates/Internal/Recruitment/Vacant/Candidate/Candidate.vue";
import HistoryController from "@/components/controllers/Internal/Recruitment/HistoryController.vue";
import History from "@/components/templates/Internal/Recruitment/Vacant/Candidate/History.vue";
import CriminalRecordController from "@/components/controllers/Internal/Recruitment/CriminalRecordController.vue";
import InterviewInitialController from "@/components/controllers/Internal/Recruitment/InterviewInitialController.vue";
import InterviewPsychotechnicalController from "@/components/controllers/Internal/Recruitment/InterviewPsychotechnicalController.vue";
import ExamPolygraphController from "@/components/controllers/Internal/Recruitment/ExamPolygraphController.vue";
import ExamMedicalController from "@/components/controllers/Internal/Recruitment/ExamMedicalController.vue";
import TestTechnicalController from "@/components/controllers/Internal/Recruitment/TestTechnicalController.vue";
import TestPsychotechnicalController from "@/components/controllers/Internal/Recruitment/TestPsychotechnicalController.vue";
import TestPsychotechnical from "@/components/templates/Internal/Recruitment/Vacant/Candidate/Test/TestPsychotechnical/TestPsychotechnical.vue";
import InterviewInitial from "@/components/templates/Internal/Recruitment/Vacant/Candidate/Interview/InterviewInitial/InterviewInitial.vue";
import InterviewPsychotechnical from "@/components/templates/Internal/Recruitment/Vacant/Candidate/Interview/InterviewPsychotechnical/InterviewPsychotechnical.vue";
import CriminalRecord from "@/components/templates/Internal/Recruitment/Vacant/Candidate/CriminalRecord/CriminalRecord.vue";
import ExamPolygraph from "@/components/templates/Internal/Recruitment/Vacant/Candidate/Examinations/ExamPolygraph/ExamPolygraph.vue";
import ExamMedical from "@/components/templates/Internal/Recruitment/Vacant/Candidate/Examinations/ExamMedical/ExamMedical.vue";
import TestTechnical from "@/components/templates/Internal/Recruitment/Vacant/Candidate/Test/TestTechnical/TestTechnical.vue";
import ScheduleInterviewInitialController from "@/components/controllers/Internal/Recruitment/ScheduleInterviewInitialController.vue";
import ScheduleInterviewInitial from "@/components/templates/Internal/Recruitment/ScheduleInterview/ScheduleInterviewInitial/ScheduleInterviewInitial.vue";
import ScheduleInterviewPsychotechnical from "@/components/templates/Internal/Recruitment/ScheduleInterview/ScheduleInterviewPsychotechnical/ScheduleInterviewPsychotechnical.vue";
import ScheduleInterviewPsychotechnicalController from "@/components/controllers/Internal/Recruitment/ScheduleInterviewPsychotechnicalController.vue";
import ScheduleTestTechnicalController from "@/components/controllers/Internal/Recruitment/ScheduleTestTechnicalController.vue";
import ScheduleTestTechnical from "@/components/templates/Internal/Recruitment/ScheduleTest/ScheduleTestTechnical/ScheduleTestTechnical.vue";
import ScheduleTestPsychotechnicalController from "@/components/controllers/Internal/Recruitment/ScheduleTestPsychotechnicalController.vue";
import ScheduleTestPsychotechnical from "@/components/templates/Internal/Recruitment/ScheduleTest/ScheduleTestPsychotechnical/ScheduleTestPsychotechnical.vue";
import ScheduleExamMedicalController from "@/components/controllers/Internal/Recruitment/ScheduleExamMedicalController.vue";
import ScheduleExamMedical from "@/components/templates/Internal/Recruitment/ScheduleExam/ScheduleExamMedical/ScheduleExamMedical.vue";
import ScheduleExamPolygraphController from "@/components/controllers/Internal/Recruitment/ScheduleExamPolygraphController.vue";
import ScheduleExamPolygraph from "@/components/templates/Internal/Recruitment/ScheduleExam/ScheduleExamPolygraph/ScheduleExamPolygraph.vue";
import FiscalDocumentController from "@/components/controllers/Internal/Setting/FiscalDocumentController.vue";
import FiscalDocument from "@/components/templates/Internal/Setting/FiscalDocument/FiscalDocument.vue";
import SettingController from "@/components/controllers/Internal/Setting/SettingController.vue";
import Setting from "@/components/templates/Internal/Setting/Setting.vue";
import RecruitmentController from "@/components/controllers/Internal/Recruitment/RecruitmentController.vue";
import Recruitment from "@/components/templates/Internal/Recruitment/Recruitment.vue";
import EnterpriseExt from "@/components/templates/External/Public/Enterprise/Enterprise.vue";
import EnterpriseControllerExt from "@/components/controllers/External/Public/EnterpriseController.vue";
import VacantExternalController from "@/components/controllers/External/Public/VacantController.vue";
import VacantExternal from "@/components/templates/External/Public/Vacant/Vacant.vue";
import InterviewVideo from "@/components/templates/Internal/Recruitment/Vacant/Candidate/Preselection/InterviewVideo/InterviewVideo.vue";
import InterviewVideoController from "@/components/controllers/Internal/Recruitment/InterviewVideoController.vue";
import TestInitalController from "@/components/controllers/Internal/Recruitment/TestInitalController.vue";
import TestInital from "@/components/templates/Internal/Recruitment/Vacant/Candidate/Preselection/TestInital/TestInital.vue";
import ServiceProviderController from "@/components/controllers/Internal/Setting/ServiceProviderController.vue";
import ServiceProvider from "@/components/templates/Internal/Setting/ServiceProvider/ServiceProvider.vue";
import FormController from "@/components/controllers/Internal/Setting/FormController.vue";
import Form from "@/components/templates/Internal/Setting/Form/Form.vue";
import PersonnelRequisitionControllerValidation from "@/components/controllers/Internal/Validation/PersonnelRequisitionController.vue";
import PersonnelRequisitionValidation from "@/components/templates/Internal/Validation/PersonnelRequisition/PersonnelRequisition.vue";
import ValidationController from "@/components/controllers/Internal/Validation/ValidationController.vue";
import Validation from "@/components/templates/Internal/Validation/Validation.vue";
import PersonnelEntryController from "@/components/controllers/Internal/Validation/PersonnelEntryController.vue";
import PersonnelEntry from "@/components/templates/Internal/Validation/PersonnelEntry/PersonnelEntry.vue";
import ValidationAffiliationController from "@/components/controllers/Internal/Validation/AffiliationController.vue";
import ValidationAffiliation from "@/components/templates/External/Private/Application/Affiliation.vue";
import Contract from "@/components/templates/Internal/Validation/Contract/Contract.vue";
import ValidationContractController from "@/components/controllers/Internal/Validation/ContractController.vue";
import ContractController from "@/components/controllers/Internal/Hiring/ContractController.vue";
import Hiring from "@/components/templates/Internal/Hiring/Hiring.vue";
import HiringController from "@/components/controllers/Internal/Hiring/HiringController.vue";
import HiringAffiliationController from "@/components/controllers/Internal/Hiring/AffiliationController.vue";
import HiringAffiliation from "@/components/templates/Internal/Hiring/Affiliation/Affiliation.vue";
import PolicyTypeController from "@/components/controllers/Internal/Setting/PolicyTypeController.vue";
import PolicyType from "@/components/templates/Internal/Setting/PolicyType/PolicyType.vue";
import PersonController from "@/components/controllers/Internal/Setting/PersonController.vue";
import RoleController from "@/components/controllers/Internal/Setting/RoleController.vue";
import Role from "@/components/templates/Internal/Setting/Role/Role.vue";
import PermissionController from "@/components/controllers/Internal/Setting/PermissionController.vue";
import Permission from "@/components/templates/Internal/Setting/Permission/Permission.vue";
import EmployeeController from "@/components/controllers/Internal/Setting/EmployeeController.vue";
import Employee from "@/components/templates/Internal/Setting/Employee/Employee.vue";
import NavegationController from "@/components/controllers/Internal/Setting/NavegationController.vue";
import Navegation from "@/components/templates/Internal/Setting/Navegation/Navegation.vue";
import SubModuleController from "@/components/controllers/Internal/Setting/SubModuleController.vue";
import SubModule from "@/components/templates/Internal/Setting/Navegation/SubModule/SubModule.vue";
import NotificationTypeController from "@/components/controllers/Internal/Setting/NotificationTypeController.vue";
import NotificationType from "@/components/templates/Internal/Setting/NotificationType/NotificationType.vue";
import PetitionController from "@/components/controllers/Internal/Petition/PetitionController.vue";
import Petition from "@/components/templates/Internal/Petition/Petition.vue";
import AbsenceController from "@/components/controllers/Internal/Petition/AbsenceController.vue";
import Absence from "@/components/templates/Internal/Petition/Absence/Absence.vue";
import VacationController from "@/components/controllers/Internal/Petition/VacationController.vue";
import Vacation from "@/components/templates/Internal/Petition/Vacation/Vacation.vue";
import Severance from "@/components/templates/Internal/Petition/Severance/Severance.vue";
import SeveranceController from "@/components/controllers/Internal/Petition/SeveranceController.vue";
import Disability from "@/components/templates/Internal/Petition/Disability/Disability.vue";
import DisabilityController from "@/components/controllers/Internal/Petition/DisabilityController.vue";
import LicenseController from "@/components/controllers/Internal/Petition/LicenseController.vue";
import License from "@/components/templates/Internal/Petition/License/License.vue";
import CertificatesController from "@/components/controllers/Internal/Petition/CertificatesController.vue";
import Certificates from "@/components/templates/Internal/Petition/Certificates/Certificates.vue";
import ValidationAbsenceController from "@/components/controllers/Internal/Validation/AbsenceController.vue";
import ValidationAbsence from "@/components/templates/Internal/Validation/Absence/Absence.vue";
import ValidationVacationController from "@/components/controllers/Internal/Validation/VacationController.vue";
import ValidationVacation from "@/components/templates/Internal/Validation/Vacation/Vacation.vue";
import ValidationSeveranceController from "@/components/controllers/Internal/Validation/SeveranceController.vue";
import ValidationSeverance from "@/components/templates/Internal/Validation/Severance/Severance.vue";
import ValidationDisabilityController from "@/components/controllers/Internal/Validation/DisabilityController.vue";
import ValidationDisability from "@/components/templates/Internal/Validation/Disability/Disability.vue";
import ValidationLicenseController from "@/components/controllers/Internal/Validation/LicenseController.vue";
import ValidationLicense from "@/components/templates/Internal/Validation/License/License.vue";
import LaborRelationController from "@/components/controllers/Internal/LaborRelation/LaborRelationController.vue";
import LaborRelation from "@/components/templates/Internal/LaborRelation/LaborRelation.vue";
import ResignationController from "@/components/controllers/Internal/LaborRelation/ResignationController.vue";
import Resignation from "@/components/templates/Internal/LaborRelation/Resignation/Resignation.vue";
import TerminationController from "@/components/controllers/Internal/LaborRelation/TerminationController.vue";
import Termination from "@/components/templates/Internal/LaborRelation/Termination/Termination.vue";
import AddendumType from "@/components/templates/Internal/Setting/AddendumType/AddendumType.vue";
import AddendumTypeController from "@/components/controllers/Internal/Setting/AddendumTypeController.vue";
import WelfareController from "@/components/controllers/Internal/Welfare/WelfareController.vue";
import Welfare from "@/components/templates/Internal/Welfare/Welfare.vue";
import InductionProgressController from "@/components/controllers/Internal/Welfare/InductionController.vue";
import InductionProgress from "@/components/templates/Internal/Welfare/Induction/Induction.vue";
import Memorandum from "@/components/templates/Internal/LaborRelation/Memorandum/Memorandum.vue";
import MemorandumController from "@/components/controllers/Internal/LaborRelation/MemorandumController.vue";
import AbsenceTypeController from "@/components/controllers/Internal/Setting/AbsenceTypeController.vue";
import AbsenceType from "@/components/templates/Internal/Setting/AbsenceType/AbsenceType.vue";
import VacationTypeController from "@/components/controllers/Internal/Setting/VacationTypeController.vue";
import VacationType from "@/components/templates/Internal/Setting/VacationType/VacationType.vue";
import SeveranceTypeController from "@/components/controllers/Internal/Setting/SeveranceTypeController.vue";
import SeveranceType from "@/components/templates/Internal/Setting/SeveranceType/SeveranceType.vue";
import DisabilityTypeController from "@/components/controllers/Internal/Setting/DisabilityTypeController.vue";
import DisabilityType from "@/components/templates/Internal/Setting/DisabilityType/DisabilityType.vue";
import LicenseTypeController from "@/components/controllers/Internal/Setting/LicenseTypeController.vue";
import LicenseType from "@/components/templates/Internal/Setting/LicenseType/LicenseType.vue";
import ResignationTypeController from "@/components/controllers/Internal/Setting/ResignationTypeController.vue";
import ResignationType from "@/components/templates/Internal/Setting/ResignationType/ResignationType.vue";
import TerminationTypeController from "@/components/controllers/Internal/Setting/TerminationTypeController.vue";
import TerminationType from "@/components/templates/Internal/Setting/TerminationType/TerminationType.vue";
import ReasonController from "@/components/controllers/Internal/Setting/ReasonController.vue";
import Reason from "@/components/templates/Internal/Setting/TerminationType/Reason/Reason.vue";
import MyProfileController from "./components/controllers/Internal/MyProfileController.vue";
import MyProfile from "./components/templates/Internal/MyProfile/MyProfile.vue";
import ExtendProfileController from "./components/controllers/Internal/ExtendProfileController.vue";
import ExtendProfile from "./components/templates/Internal/MyProfile/ExtendProfile/ExtendProfile.vue";
import EndowmentController from "./components/controllers/Internal/Welfare/EndowmentController.vue";
import Endowment from "./components/templates/Internal/Welfare/Endowment/Endowment.vue";
// import InductionManagementController from "./components/controllers/Internal/Setting/InductionManagementController.vue";
// import InductionManagement from "./components/templates/Internal/Setting/InductionManagement/InductionManagement.vue";
// import VideoController from "./components/controllers/Internal/Setting/VideoController.vue";
// import Video from "./components/templates/Internal/Setting/InductionManagement/Video/Video.vue";
import MyContractController from "./components/controllers/Internal/MyContractController.vue";
import MyContract from "./components/templates/Internal/MyProfile/MyContract/MyContract.vue";
import LoginController from "./components/controllers/Internal/LoginController.vue";
import LoginInternal from "./components/templates/Internal/Auth/Login.vue";
import TypeEndowmentController from "./components/controllers/Internal/Setting/TypeEndowmentController.vue";
import TypeEndowment from "./components/templates/Internal/Setting/TypeEndowment/TypeEndowment.vue";
import InductionController from "./components/controllers/Internal/Setting/InductionController.vue";
import Induction from "./components/templates/Internal/Setting/Induction/Induction.vue";
import StepController from "./components/controllers/Internal/Setting/StepController.vue";
import Step from "./components/templates/Internal/Setting/Induction/Step/Step.vue";
import DischargesController from "./components/controllers/Internal/LaborRelation/DischargesController.vue";
import Discharges from "./components/templates/Internal/LaborRelation/Discharges/Discharges.vue";
import PositionDeliveryController from "./components/controllers/Internal/LaborRelation/PositionDeliveryController.vue";
import PositionDelivery from "./components/templates/Internal/LaborRelation/PositionDelivery/PositionDelivery.vue";
import ValidationPositionDeliveryController from "./components/controllers/Internal/Validation/ValidationPositionDeliveryController.vue";
import ValidationPositionDelivery from "./components/templates/Internal/Validation/ValidationPositionDelivery/ValidationPositionDelivery.vue";
import PetitionPositionDeliveryController from "./components/controllers/Internal/Petition/PetitionPositionDeliveryController.vue";
import PetitionPositionDelivery from "./components/templates/Internal/Petition/PetitionPositionDelivery/PetitionPositionDelivery.vue";
import PetitionMemorandumController from "./components/controllers/Internal/Petition/PetitionMemorandumController.vue";
import PetitionMemorandum from "./components/templates/Internal/Petition/PetitionMemorandum/PetitionMemorandum.vue";
import ReportsOneController from "./components/controllers/Internal/Reports/ReportsOneController.vue";
import ReportsOne from "./components/templates/Internal/Reports/ReportsOne/ReportsOne.vue";
import ReportsController from "./components/controllers/Internal/Reports/ReportsController.vue";
import Reports from "./components/templates/Internal/Reports/Reports.vue";
import ActivesController from "./components/controllers/Internal/Reports/ActivesController.vue";
import Actives from "./components/templates/Internal/Reports/Actives/Actives.vue";
import AttritionController from "./components/controllers/Internal/Reports/AttritionController.vue";
import Attrition from "./components/templates/Internal/Reports/Attrition/Attrition.vue";
import RotationController from "./components/controllers/Internal/Reports/RotationController.vue";
import Rotation from "./components/templates/Internal/Reports/Rotation/Rotation.vue";
import ReportsAbsenceController from "./components/controllers/Internal/Reports/AbsenceController.vue";
import ReportsAbsence from "./components/templates/Internal/Reports/Absence/Absence.vue";
import FollowUpController from "./components/controllers/Internal/Reports/FollowUpController.vue";
import FollowUp from "./components/templates/Internal/Reports/FollowUp/FollowUp.vue";
const routes = [
  {
    path: "/login/:pathMatch(.*)*",
    redirect: "/login",
  },
  {
    path: "/login",
    component: AuthController,
    children: [
      {
        path: "",
        name: "LoginView",
        component: Login,
      },
    ],
  },
  {
    path: "/login/internal",
    name: "LoginInternal",
    component: LoginController,
    children: [
      {
        path: "",
        name: "LoginInternalView",
        component: LoginInternal,
      },
    ],
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterController,
    children: [
      {
        path: "",
        name: "RegisterView",
        component: Register,
      },
    ],
  },
  {
    path: "/forgot-password",
    name: "Recovery",
    component: RecoveryController,
    children: [
      {
        path: "",
        name: "RecoveryView",
        component: Recovery,
      },
    ],
  },
  {
    path: "/verify",
    name: "Verify",
    component: VerifyController,
    children: [
      {
        path: "",
        name: "VerifyView",
        component: Verify,
      },
    ],
  },
  {
    path: "/change-password",
    name: "Change",
    component: ChangeController,
    children: [
      {
        path: "",
        name: "ChangeView",
        component: Change,
      },
    ],
  },
  {
    path: "/profile",
    name: "Profile",
    component: ProfileController,
    children: [
      {
        path: "",
        name: "ProfileView",
        component: Profile,
      },
    ],
  },
  {
    path: "/",
    name: "Vacant",
    component: VacantExternalController,
    children: [
      {
        path: "",
        name: "VacantView",
        component: VacantExternal,
      },
    ],
  },
  {
    path: "/enterprise",
    name: "EnterpriseExt",
    component: EnterpriseControllerExt,
    children: [
      {
        path: "",
        name: "EnterpriseExtView",
        component: EnterpriseExt,
      },
    ],
  },
  {
    path: "/favorite",
    name: "Favorite",
    component: FavoriteController,
    children: [
      {
        path: "",
        name: "FavoriteView",
        component: Favorite,
      },
    ],
  },
  {
    path: "/application",
    name: "Application",
    component: ApplicationController,
    children: [
      {
        path: "",
        name: "ApplicationView",
        component: Application,
      },
    ],
  },
  {
    path: "/test",
    name: "Test",
    component: TestController,
    children: [
      {
        path: "",
        name: "TestView",
        component: Test,
      },
    ],
  },
  {
    path: "/me/profile",
    name: "MyProfile",
    component: MyProfileController,
    children: [
      {
        path: "",
        name: "MyProfileView",
        component: MyProfile,
      },
    ],
  },
  {
    path: "/me/extend-profile",
    name: "extendProfile",
    component: ExtendProfileController,
    children: [
      {
        path: "",
        name: "extendProfileView",
        component: ExtendProfile,
      },
    ],
  },
  {
    path: "/me/Contract",
    name: "meContract",
    component: MyContractController,
    children: [
      {
        path: "",
        name: "meContractView",
        component: MyContract,
      },
    ],
  },
  {
    path: "/home",
    name: "Home",
    component: IndexController,
    children: [
      {
        path: "",
        name: "HomeView",
        component: Index,
      },
    ],
  },
  {
    path: "/setting",
    name: "setting",
    component: SettingController,
    meta: {
      requiresAuth: true,
      permission: "PersonnelRequisitionManagement.Index",
    },
    children: [
      {
        path: "",
        name: "SettingView",
        component: Setting,
      },
    ],
  },

  {
    path: "/setting/form",
    name: "setting-form",
    component: FormController,
    children: [
      {
        path: "",
        name: "FormView",
        component: Form,
      },
    ],
  },

  {
    path: "/setting/enterprise",
    name: "setting-enterprise",
    component: EnterpriseController,
    children: [
      {
        path: "",
        name: "EnterpriseView",
        component: Enterprise,
      },
    ],
  },

  {
    path: "/setting/enterprise/entity",
    name: "Setting-entity",
    component: EntityController,
    children: [
      {
        path: "",
        name: "EntityView",
        component: Entity,
      },
    ],
  },

  {
    path: "/setting/enterprise/entity/gallery",
    name: "Setting-entity-gallery",
    component: GalleryController,
    children: [
      {
        path: "",
        name: "GalleryView",
        component: Gallery,
      },
    ],
  },

  {
    path: "/setting/enterprise/entity/headquarter",
    name: "Setting-entity-headquarter",
    component: HeadquarterController,
    children: [
      {
        path: "",
        name: "HeadquarterView",
        component: Headquarter,
      },
    ],
  },

  {
    path: "/setting/enterprise/entity/template",
    name: "Setting-entity-template",
    component: TemplateController,
    children: [
      {
        path: "",
        name: "TemplateView",
        component: Template,
      },
    ],
  },

  {
    path: "/setting/enterprise/entity/profile",
    name: "Setting-entity-profile",
    component: EntityController,
    children: [
      {
        path: "",
        name: "TemplateView",
        component: Entity,
      },
    ],
  },

  {
    path: "/setting/enterprise/entity/organizational-structure",
    name: "Setting-entity-organizational-structure",
    component: OrganizationalStructureController,
    children: [
      {
        path: "",
        name: "OrganizationalStructureView",
        component: OrganizationalStructure,
      },
    ],
  },

  {
    path: "/setting/enterprise/entity/ally",
    name: "Setting-entity-ally",
    component: AllyController,
    children: [
      {
        path: "",
        name: "AllyView",
        component: Ally,
      },
    ],
  },

  {
    path: "/setting/enterprise/entity/ally/campaign",
    name: "Setting-entity-ally-campaign",
    component: CampaignController,
    children: [
      {
        path: "",
        name: "CampaignView",
        component: Campaign,
      },
    ],
  },

  {
    path: "/setting/area",
    name: "SettingArea",
    component: AreaController,
    children: [
      {
        path: "",
        name: "AreaIndex",
        component: Area,
      },
    ],
  },

  {
    path: "/setting/skill",
    name: "SettingSkills",
    component: SkillController,
    children: [
      {
        path: "",
        name: "SkillsIndex",
        component: Skill,
      },
    ],
  },

  {
    path: "/setting/marital-status",
    name: "SettingMaritalStatus",
    component: MaritalStatusController,
    children: [
      {
        path: "",
        name: "MaritalStatusIndex",
        component: IndexMaritalStatus,
      },
    ],
  },

  {
    path: "/setting/work-arrangement",
    name: "SettingWorkArrangement",
    component: WorkArrangementController,
    children: [
      {
        path: "",
        name: "WorkArrangementIndex",
        component: WorkArrangement,
      },
    ],
  },

  {
    path: "/setting/phone-validation",
    name: "DashboarPhoneValidation",
    component: PhoneValidationController,
    children: [
      {
        path: "",
        name: "PhoneValidationIndex",
        component: PhoneValidation,
      },
    ],
  },

  {
    path: "/setting/benefit",
    name: "SettingBenefits",
    component: BenefitController,
    children: [
      {
        path: "",
        name: "BenefitsIndex",
        component: Benefit,
      },
    ],
  },

  {
    path: "/setting/academic-level",
    name: "SettingAcademicLevel",
    component: AcademicLevelController,
    children: [
      {
        path: "",
        name: "AcademicLevelIndex",
        component: AcademicLevel,
      },
    ],
  },

  {
    path: "/setting/document-type",
    name: "SettingDocumentType",
    component: DocumentTypeController,
    children: [
      {
        path: "",
        name: "DocumentTypeIndex",
        component: DocumentType,
      },
    ],
  },

  {
    path: "/setting/work-day",
    name: "SettingWorkDay",
    component: WorkDayController,
    children: [
      {
        path: "",
        name: "WorkModalityIndex",
        component: WorkDay,
      },
    ],
  },

  {
    path: "/setting/fiscal-document",
    name: "SettingFiscalDocument",
    component: FiscalDocumentController,
    children: [
      {
        path: "",
        name: "FiscalDocumentIndex",
        component: FiscalDocument,
      },
    ],
  },

  {
    path: "/setting/contract-type",
    name: "SettingTypeContract",
    component: ContractTypeController,
    children: [
      {
        path: "",
        name: "TypeContractIndex",
        component: ContractType,
      },
    ],
  },

  {
    path: "/setting/risk-manager",
    name: "SettingRiskManager",
    component: RiskManagerController,
    children: [
      {
        path: "",
        name: "RiskManagerIndex",
        component: RiskManager,
      },
    ],
  },

  {
    path: "/setting/health-entity",
    name: "SettingHealthEntity",
    component: HealthEntityController,
    children: [
      {
        path: "",
        name: "HealthEntityIndex",
        component: HealthEntity,
      },
    ],
  },

  {
    path: "/setting/service-provider",
    name: "SettingServiceProvider",
    component: ServiceProviderController,
    children: [
      {
        path: "",
        name: "ServiceProviderIndex",
        component: ServiceProvider,
      },
    ],
  },

  {
    path: "/setting/compensation-fund",
    name: "SettingCompensationFund",
    component: CompensationFundController,
    children: [
      {
        path: "",
        name: "CompensationFundIndex",
        component: CompensationFund,
      },
    ],
  },

  {
    path: "/setting/bank",
    name: "Settingbank",
    component: BankController,
    children: [
      {
        path: "",
        name: "BankIndex",
        component: Bank,
      },
    ],
  },

  {
    path: "/setting/pension-fund",
    name: "SettingpensionFund",
    component: PensionFundController,
    children: [
      {
        path: "",
        name: "PensionFundIndex",
        component: PensionFund,
      },
    ],
  },

  {
    path: "/setting/entity-type",
    name: "SettingEntityType",
    component: EntityTypeController,
    children: [
      {
        path: "",
        name: "EntityTypeIndex",
        component: EntityType,
      },
    ],
  },
  {
    path: "/setting/policy-type",
    name: "SettingPolicyType",
    component: PolicyTypeController,
    children: [
      {
        path: "",
        name: "PolicyTypeIndex",
        component: PolicyType,
      },
    ],
  },
  {
    path: "/setting/addendum-type",
    name: "SettingAddendumType",
    component: AddendumTypeController,
    children: [
      {
        path: "",
        name: "AddendumTypeIndex",
        component: AddendumType,
      },
    ],
  },
  {
    path: "/setting/person",
    name: "SettingPerson",
    component: PersonController,
    children: [
      {
        path: "",
        name: "PersonIndex",
        component: PersonController,
      },
    ],
  },
  {
    path: "/recruitment",
    name: "Recruitment",
    component: RecruitmentController,
    meta: {
      requiresAuth: true,
      permission: "PersonnelRequisitionManagement.Index",
    },
    children: [
      {
        path: "",
        name: "RecruitmentIndex",
        component: Recruitment,
      },
    ],
  },

  {
    path: "/recruitment/personnel-requisition",
    name: "recruitmentPersonnelRequisition",
    component: PersonnelRequisitionController,
    children: [
      {
        path: "",
        name: "PersonnelRequisitionIndex",
        component: IndexPersonnelRequisition,
      },
    ],
  },

  {
    path: "/setting/epidemiological-program",
    name: "SettingEpidemiologicalProgram",
    component: EpidemiologicalProgramController,
    children: [
      {
        path: "",
        name: "epidemiologicalProgramIndex",
        component: EpidemiologicalProgram,
      },
    ],
  },

  {
    path: "/setting/position",
    name: "SettingPosition",
    component: PositionController,
    children: [
      {
        path: "",
        name: "PositionIndex",
        component: Position,
      },
    ],
  },
  {
    path: "/setting/role",
    name: "Role",
    component: RoleController,
    children: [
      {
        path: "",
        name: "RoleIndex",
        component: Role,
      },
    ],
  },
  {
    path: "/setting/permission",
    name: "Permission",
    component: PermissionController,
    children: [
      {
        path: "",
        name: "PermissionIndex",
        component: Permission,
      },
    ],
  },
  {
    path: "/setting/employee",
    name: "Employee",
    component: EmployeeController,
    children: [
      {
        path: "",
        name: "PermissionIndex",
        component: Employee,
      },
    ],
  },
  {
    path: "/setting/navegation",
    name: "Navegation",
    component: NavegationController,
    children: [
      {
        path: "",
        name: "NavegationIndex",
        component: Navegation,
      },
    ],
  },
  {
    path: "/setting/navegation/SubModule",
    name: "SubModule",
    component: SubModuleController,
    children: [
      {
        path: "",
        name: "SubmoduleIndex",
        component: SubModule,
      },
    ],
  },
  {
    path: "/setting/notification-type",
    name: "NotificationType",
    component: NotificationTypeController,
    children: [
      {
        path: "",
        name: "NotificationTypeIndex",
        component: NotificationType,
      },
    ],
  },
  {
    path: "/setting/absence-type",
    name: "AbsenceType",
    component: AbsenceTypeController,
    meta: {
      requiresAuth: true,
      permission: "AbsenceTypes.All",
    },
    children: [
      {
        path: "",
        name: "AbsenceTypeIndex",
        component: AbsenceType,
      },
    ],
  },
  {
    path: "/setting/vacation-type",
    name: "VacationType",
    component: VacationTypeController,
    meta: {
      requiresAuth: true,
      permission: "VacationTypes.All",
    },
    children: [
      {
        path: "",
        name: "VacationTypeIndex",
        component: VacationType,
      },
    ],
  },
  {
    path: "/setting/severance-type",
    name: "SeveranceType",
    component: SeveranceTypeController,
    children: [
      {
        path: "",
        name: "SeveranceTypeIndex",
        component: SeveranceType,
      },
    ],
  },
  {
    path: "/setting/disability-type",
    name: "DisabilityType",
    component: DisabilityTypeController,
    meta: {
      requiresAuth: true,
      permission: "DisabilityTypes.All",
    },
    children: [
      {
        path: "",
        name: "DisabilityTypeIndex",
        component: DisabilityType,
      },
    ],
  },
  {
    path: "/setting/license-type",
    name: "LicenseType",
    component: LicenseTypeController,
    meta: {
      requiresAuth: true,
      permission: "LicenseTypes.All",
    },
    children: [
      {
        path: "",
        name: "LicenseTypeIndex",
        component: LicenseType,
      },
    ],
  },
  {
    path: "/setting/resignation-type",
    name: "resignationType",
    component: ResignationTypeController,
    children: [
      {
        path: "",
        name: "resignationTypeIndex",
        component: ResignationType,
      },
    ],
  },
  {
    path: "/setting/termination-type",
    name: "TerminationType",
    component: TerminationTypeController,
    children: [
      {
        path: "",
        name: "TerminationTypeIndex",
        component: TerminationType,
      },
    ],
  },
  {
    path: "/setting/termination-type/reason",
    name: "reason",
    component: ReasonController,
    children: [
      {
        path: "",
        name: "reasonIndex",
        component: Reason,
      },
    ],
  },
  {
    path: "/setting/induction",
    name: "Induction",
    component: InductionController,
    children: [
      {
        path: "",
        name: "InductionIndex",
        component: Induction,
      },
    ],
  },
  {
    path: "/setting/induction/step",
    name: "Step",
    component: StepController,
    children: [
      {
        path: "",
        name: "StepIndex",
        component: Step,
      },
    ],
  },
  {
    path: "/setting/type-endowment",
    name: "TypeEndowment",
    component: TypeEndowmentController,
    children: [
      {
        path: "",
        name: "TypeEndowmentIndex",
        component: TypeEndowment,
      },
    ],
  },
  {
    path: "/recruitment/vacant",
    name: "RecruitmentVacant",
    component: RecruitmentVacantController,
    children: [
      {
        path: "",
        name: "VacantIndex",
        component: RecruimentVacant,
      },
    ],
  },

  {
    path: "/recruitment/vacant/candidate",
    name: "RecruitmentCandidate",
    component: CandidateControlle,
    children: [
      {
        path: "",
        name: "CandidateIndex",
        component: Candidate,
      },
    ],
  },
  {
    path: "/recruitment/vacant/candidate/interview-video",
    name: "RecruitmentCandidateInterviewVideo",
    component: InterviewVideoController,
    children: [
      {
        path: "",
        name: "CandidateInterviewVideo",
        component: InterviewVideo,
      },
    ],
  },
  {
    path: "/recruitment/vacant/candidate/test-initial",
    name: "RecruitmentCandidateTestInital",
    component: TestInitalController,
    children: [
      {
        path: "",
        name: "CandidateTestInital",
        component: TestInital,
      },
    ],
  },
  {
    path: "/Recruitment/vacant/candidate/history",
    name: "RecruitmentCandidateHistory",
    component: HistoryController,
    children: [
      {
        path: "",
        name: "CandidateHistory",
        component: History,
      },
    ],
  },
  {
    path: "/recruitment/vacant/candidate/criminal-record",
    name: "RecruitmentCandidateCriminalRecord",
    component: CriminalRecordController,
    children: [
      {
        path: "",
        name: "CriminalRecordIndex",
        component: CriminalRecord,
      },
    ],
  },
  {
    path: "/recruitment/vacant/candidate/interview-initial",
    name: "RecruitmentCandidateInterviewInitial",
    component: InterviewInitialController,
    children: [
      {
        path: "",
        name: "CandidateInterviewInitial",
        component: InterviewInitial,
      },
    ],
  },
  {
    path: "/recruitment/vacant/candidate/interview-psychotechnical",
    name: "RecruitmentCandidateInterviewPsychotechnical",
    component: InterviewPsychotechnicalController,
    children: [
      {
        path: "",
        name: "CandidateInterviewPsychotechnical",
        component: InterviewPsychotechnical,
      },
    ],
  },
  {
    path: "/recruitment/vacant/candidate/exam-polygraph",
    name: "RecruitmentCandidateExamPolygraph",
    component: ExamPolygraphController,
    children: [
      {
        path: "",
        name: "CandidateExamPolygraph",
        component: ExamPolygraph,
      },
    ],
  },
  {
    path: "/recruitment/vacant/candidate/exam-medical",
    name: "RecruitmentCandidateExamMedical",
    component: ExamMedicalController,
    children: [
      {
        path: "",
        name: "CandidateExamMedical",
        component: ExamMedical,
      },
    ],
  },
  {
    path: "/recruitment/vacant/candidate/test-technical",
    name: "RecruitmentCandidateTestTechnical",
    component: TestTechnicalController,
    children: [
      {
        path: "",
        name: "CandidateTestTechnical",
        component: TestTechnical,
      },
    ],
  },
  {
    path: "/recruitment/vacant/candidate/test-psychotechnical",
    name: "RecruitmentCandidateTestPsychotechnical",
    component: TestPsychotechnicalController,
    children: [
      {
        path: "",
        name: "CandidateTestPsychotechnical",
        component: TestPsychotechnical,
      },
    ],
  },
  {
    path: "/recruitment/schedule-interview-initial",
    name: "RecruitmentScheduleInterviewInitial",
    component: ScheduleInterviewInitialController,
    children: [
      {
        path: "",
        name: "ScheduleInterviewInitial",
        component: ScheduleInterviewInitial,
      },
    ],
  },
  {
    path: "/recruitment/schedule-interview-psychotechnical",
    name: "RecruitmentScheduleInterviewPsychotechnical",
    component: ScheduleInterviewPsychotechnicalController,
    children: [
      {
        path: "",
        name: "ScheduleInterviewPsychotechnical",
        component: ScheduleInterviewPsychotechnical,
      },
    ],
  },
  {
    path: "/recruitment/schedule-test-technical",
    name: "RecruitmentScheduleTestTechnical",
    component: ScheduleTestTechnicalController,
    children: [
      {
        path: "",
        name: "ScheduleTestTechnical",
        component: ScheduleTestTechnical,
      },
    ],
  },
  {
    path: "/recruitment/schedule-test-psychotechnical",
    name: "RecruitmentScheduleTestPsychotechnical",
    component: ScheduleTestPsychotechnicalController,
    children: [
      {
        path: "",
        name: "ScheduleTestPsychotechnical",
        component: ScheduleTestPsychotechnical,
      },
    ],
  },
  {
    path: "/recruitment/schedule-exam-medical",
    name: "RecruitmentScheduleExamMedical",
    component: ScheduleExamMedicalController,
    children: [
      {
        path: "",
        name: "ScheduleExamMedical",
        component: ScheduleExamMedical,
      },
    ],
  },
  {
    path: "/recruitment/schedule-exam-polygraph",
    name: "RecruitmentScheduleExamPolygraph",
    component: ScheduleExamPolygraphController,
    children: [
      {
        path: "",
        name: "ScheduleExamPolygraph",
        component: ScheduleExamPolygraph,
      },
    ],
  },
  {
    path: "/validation",
    name: "Validation",
    component: ValidationController,
    children: [
      {
        path: "",
        name: "PersonnelRequisition",
        component: Validation,
      },
    ],
  },
  {
    path: "/validation/personnel-requisition",
    name: "ValidationPersonnelRequisition",
    component: PersonnelRequisitionControllerValidation,
    children: [
      {
        path: "",
        name: "PersonnelRequisition",
        component: PersonnelRequisitionValidation,
      },
    ],
  },
  {
    path: "/validation/personnel-entry",
    name: "ValidationPersonnelEntry",
    component: PersonnelEntryController,
    children: [
      {
        path: "",
        name: "PersonnelEntry",
        component: PersonnelEntry,
      },
    ],
  },
  {
    path: "/validation/affiliation",
    name: "ValidationAffiliation",
    component: ValidationAffiliationController,
    children: [
      {
        path: "",
        name: "Affiliation",
        component: ValidationAffiliation,
      },
    ],
  },
  {
    path: "/validation/contract",
    name: "ValidationContract",
    component: ValidationContractController,
    children: [
      {
        path: "",
        name: "Contract",
        component: Contract,
      },
    ],
  },
  {
    path: "/validation/absence",
    name: "ValidationAbsence",
    component: ValidationAbsenceController,
    meta: {
      requiresAuth: true,
      permission: "AbsenceValidate.All",
    },
    children: [
      {
        path: "",
        name: "Absence",
        component: ValidationAbsence,
      },
    ],
  },
  {
    path: "/validation/vacation",
    name: "ValidationVacation",
    component: ValidationVacationController,
    meta: {
      requiresAuth: true,
      permission: "VacationValidate.All",
    },
    children: [
      {
        path: "",
        name: "Vacation",
        component: ValidationVacation,
      },
    ],
  },
  {
    path: "/validation/severance",
    name: "ValidationSeverance",
    component: ValidationSeveranceController,
    meta: {
      requiresAuth: true,
      permission: "SeveranceValidate.All",
    },
    children: [
      {
        path: "",
        name: "Contract",
        component: ValidationSeverance,
      },
    ],
  },
  {
    path: "/validation/disability",
    name: "ValidationDisability",
    component: ValidationDisabilityController,
    meta: {
      requiresAuth: true,
      permission: "DisabilityValidate.All",
    },
    children: [
      {
        path: "",
        name: "Contract",
        component: ValidationDisability,
      },
    ],
  },
  {
    path: "/validation/license",
    name: "ValidationLicense",
    component: ValidationLicenseController,
    meta: {
      requiresAuth: true,
      permission: "LeaveValidate.All",
    },
    children: [
      {
        path: "",
        name: "Contract",
        component: ValidationLicense,
      },
    ],
  },
  {
    path: "/validation/position-delivery",
    name: "ValidationPositionDelivery",
    component: ValidationPositionDeliveryController,
    children: [
      {
        path: "",
        name: "PositionDeliveryIndex",
        component: ValidationPositionDelivery,
      },
    ],
  },
  {
    path: "/hiring",
    name: "Hiring",
    component: HiringController,
    meta: {
      requiresAuth: true,
      permission: "ContractManagement.All",
    },
    children: [
      {
        path: "",
        name: "HiringIndex",
        component: Hiring,
      },
    ],
  },
  {
    path: "/hiring/contract",
    name: "HiringContract",
    component: ContractController,
    children: [
      {
        path: "",
        name: "contract",
        component: Contract,
      },
    ],
  },
  {
    path: "/hiring/affiliation",
    name: "HiringAffiliation",
    component: HiringAffiliationController,
    children: [
      {
        path: "",
        name: "Affiliation",
        component: HiringAffiliation,
      },
    ],
  },
  {
    path: "/petition",
    name: "Petition",
    component: PetitionController,
    meta: {
      requiresAuth: true,
      permissions: [
        "AbsenceManagement.All.Me",
        "AbsenceManagement.All.Team",
        "VacationManagement.All.Me",
        "VacationManagement.All.Team",
        "SeveranceManagement.All.Me",
        "SeveranceManagement.All.Team",
        "DisabilityManagement.All.Me",
        "DisabilityManagement.All.Team",
        "LeaveManagement.All.Me",
        "LeaveManagement.All.Team",
      ],
      permissionMode: "any",
    },
    children: [
      {
        path: "",
        name: "PetitionIndex",
        component: Petition,
      },
    ],
  },
  {
    path: "/petition/absence",
    name: "Absence",
    component: AbsenceController,
    meta: {
      requiresAuth: true,
      permissions: ["AbsenceManagement.All.Me", "AbsenceManagement.All.Team"],
      permissionMode: "any",
    },
    children: [
      {
        path: "",
        name: "AbsenceIndex",
        component: Absence,
      },
    ],
  },
  {
    path: "/petition/vacation",
    name: "Vacation",
    component: VacationController,
    meta: {
      requiresAuth: true,
      permissions: ["VacationManagement.All.Me", "VacationManagement.All.Team"],
      permissionMode: "any",
    },
    children: [
      {
        path: "",
        name: "VacationIndex",
        component: Vacation,
      },
    ],
  },
  {
    path: "/petition/severance",
    name: "severance",
    component: SeveranceController,
    meta: {
      requiresAuth: true,
      permissions: [
        "SeveranceManagement.All.Me",
        "SeveranceManagement.All.Team",
      ],
      permissionMode: "any",
    },
    children: [
      {
        path: "",
        name: "SeveranceIndex",
        component: Severance,
      },
    ],
  },
  {
    path: "/petition/disability",
    name: "Disability",
    component: DisabilityController,
    meta: {
      requiresAuth: true,
      permissions: [
        "DisabilityManagement.All.Me",
        "DisabilityManagement.All.Team",
      ],
      permissionMode: "any",
    },
    children: [
      {
        path: "",
        name: "DisabilityIndex",
        component: Disability,
      },
    ],
  },
  {
    path: "/petition/license",
    name: "License",
    component: LicenseController,
    meta: {
      requiresAuth: true,
      permissions: ["LeaveManagement.All.Me", "LeaveManagement.All.Team"],
      permissionMode: "any",
    },
    children: [
      {
        path: "",
        name: "LicenseIndex",
        component: License,
      },
    ],
  },
  {
    path: "/petition/certificates",
    name: "certificates",
    component: CertificatesController,
    children: [
      {
        path: "",
        name: "certificatesIndex",
        component: Certificates,
      },
    ],
  },
  {
    path: "/petition/position-delivery",
    name: "PetitionPositionDelivery",
    component: PetitionPositionDeliveryController,
    children: [
      {
        path: "",
        name: "PetitionPositionDeliveryIndex",
        component: PetitionPositionDelivery,
      },
    ],
  },
  {
    path: "/petition/memorandum",
    name: "PetitionMemorandum",
    component: PetitionMemorandumController,
    children: [
      {
        path: "",
        name: "PetitionMemorandumIndex",
        component: PetitionMemorandum,
      },
    ],
  },
  {
    path: "/labor-relation",
    name: "LaborRelations",
    component: LaborRelationController,
    meta: {
      requiresAuth: true,
      permission: "PersonnelRequisitionManagement.Index",
    },
    children: [
      {
        path: "",
        name: "laborRelationsIndex",
        component: LaborRelation,
      },
    ],
  },
  {
    path: "/labor-relation/resignation",
    name: "Resignation",
    component: ResignationController,
    children: [
      {
        path: "",
        name: "ResignationIndex",
        component: Resignation,
      },
    ],
  },
  {
    path: "/labor-relation/termination",
    name: "Termination",
    component: TerminationController,
    children: [
      {
        path: "",
        name: "TerminationIndex",
        component: Termination,
      },
    ],
  },
  {
    path: "/labor-relation/memorandum",
    name: "Memorandum",
    component: MemorandumController,
    children: [
      {
        path: "",
        name: "MemorandumIndex",
        component: Memorandum,
      },
    ],
  },
  {
    path: "/labor-relation/discharges",
    name: "Discharges",
    component: DischargesController,
    children: [
      {
        path: "",
        name: "DischargesIndex",
        component: Discharges,
      },
    ],
  },
  {
    path: "/labor-relation/position-delivery",
    name: "PositionDelivery",
    component: PositionDeliveryController,
    children: [
      {
        path: "",
        name: "PositionDeliveryIndex",
        component: PositionDelivery,
      },
    ],
  },
  {
    path: "/welfare",
    name: "Welfare",
    component: WelfareController,
    meta: {
      requiresAuth: true,
      permission: "PersonnelRequisitionManagement.Index",
    },
    children: [
      {
        path: "",
        name: "WelfareIndex",
        component: Welfare,
      },
    ],
  },
  {
    path: "/welfare/induction",
    name: "WelfareInduction",
    component: InductionProgressController,
    children: [
      {
        path: "",
        name: "WelfareInductionIndex",
        component: InductionProgress,
      },
    ],
  },
  {
    path: "/welfare/endowment",
    name: "Endowment",
    component: EndowmentController,
    children: [
      {
        path: "",
        name: "EndowmentIndex",
        component: Endowment,
      },
    ],
  },
  {
    path: "/report",
    name: "Report",
    component: ReportsController,
    meta: {
      requiresAuth: true,
      permissions: "PersonnelRequisitionManagement.Index",
    },
    children: [
      {
        path: "",
        name: "ReportIndex",
        component: Reports,
      },
    ],
  },
  {
    path: "/report/disability",
    name: "ReportDisability",
    component: ReportsOneController,
    children: [
      {
        path: "",
        name: "ReportDisabilityIndex",
        component: ReportsOne,
      },
    ],
  },
  {
    path: "/report/active",
    name: "ReportActive",
    component: ActivesController,
    children: [
      {
        path: "",
        name: "ReportActiveIndex",
        component: Actives,
      },
    ],
  },
  {
    path: "/report/attrition",
    name: "ReportAttrition",
    component: AttritionController,
    children: [
      {
        path: "",
        name: "ReportAttritionIndex",
        component: Attrition,
      },
    ],
  },
  {
    path: "/report/rotation",
    name: "ReportRotation",
    component: RotationController,
    children: [
      {
        path: "",
        name: "ReportRotationIndex",
        component: Rotation,
      },
    ],
  },
  {
    path: "/report/absence",
    name: "ReportAbsence",
    component: ReportsAbsenceController,
    children: [
      {
        path: "",
        name: "ReportAbsenceIndex",
        component: ReportsAbsence,
      },
    ],
  },

  {
    path: "/access-denied",
    name: "ReportAbsence",
    component: import("@/components/templates/External/ViewsAccess/403.vue"),
  },

  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: import("@/components/templates/External/ViewsAccess/404.vue"),
  },
  // {
  //   path: "/report/Follow-up",
  //   name: "ReportFollowUp",
  //   component: FollowUpController,
  //   children: [
  //     {
  //       path: "",
  //       name: "ReportFollowUpIndex",
  //       component: FollowUp,
  //     },
  //   ],
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

import { useAuthStore } from "@/stores/authStore";
import IndexController from "./components/controllers/Internal/IndexController.vue";
import Index from "./components/templates/Internal/Index/Index.vue";
import OrganizationalStructureController from "./components/controllers/Internal/Setting/OrganizationalStructureController.vue";
import OrganizationalStructure from "./components/templates/Internal/Setting/Enterprise/Entity/OrganizationalStructure/OrganizationalStructure.vue";
import AllyController from "./components/controllers/Internal/Setting/AllyController.vue";
import Ally from "./components/templates/Internal/Setting/Enterprise/Entity/Ally/Ally.vue";
import CampaignController from "./components/controllers/Internal/Setting/CampaignController.vue";
import Campaign from "./components/templates/Internal/Setting/Enterprise/Entity/Ally/Campaign/Campaign.vue";

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  const internalPaths = [
    "/setting",
    "/recruitment",
    "/validation",
    "/hiring",
    "/petition",
    "/labor-relation",
    "/welfare",
    "/me/profile",
    "/me/extend-profile",
    "/me/contract",
    "/report",
  ];

  const publicRoutes = [
    "/login",
    "/login/internal",
    "/register",
    "/forgot-password",
    "/",
    "/enterprise",
  ];

  const hasEmployee = !!authStore.getAuth?.employeeId;

  const isInternal = internalPaths.some((p) => to.path.startsWith(p));
  const isPublic = publicRoutes.includes(to.path);

  if (isInternal && !hasEmployee) {
    authStore.clearAuth();
    return next("/login/internal");
  }

  if (isPublic && hasEmployee) {
    authStore.clearAuth();
    return next("/login");
  }

  const requiredPermission = to.meta.permission;

  if (requiredPermission && !authStore.hasPermission(requiredPermission)) {
    return next("/access-denied");
  }

  const requiredPermissions = to.meta.permissions ?? [];

  if (Array.isArray(requiredPermissions) && requiredPermissions.length > 0) {
    const permissionMode = to.meta.permissionMode ?? "all";

    const authorized =
      permissionMode === "any"
        ? authStore.hasAnyPermission(requiredPermissions)
        : authStore.hasAllPermissions(requiredPermissions);

    if (!authorized) {
      return next("/access-denied");
    }
  }

  next();
});

export default router;
