export const services = {
    auth: 'auth',
    userService: 'user-service',
    bimbelService: 'bimbel-service',
    examService: 'tryout-service',
    paymentService: 'payment-service'
}

export const endpoint = {
    auth: {
        login: 'login',
        loginGoole: 'login-with-google',
        registerGoolge: 'register-with-google',
        register: 'register',
        validation: '',
        logout: 'logout'
    },
    client: {
        user: {
            profile: {
                simpleProfile: 'user/profile/simple'
            },
            menu: {
                listMenu: 'menu'
            }
        }
    },
    bimbel: {
        rpc: {
            stages: {
                listStages: 'stages'
            },
            subjects: {
                listSubjects: 'subject-types'
            },
            exam: {
                listQuestion: 'get-questions'
            },
            purchase: {
                purchase: 'purchase',
                purchaseList: 'purchase',
                purchaseDetail: 'purchase-status',
                purchaseStatus: 'purchase-status',
                purchaseVerifying: 'purchase/verifying',
                purchaseVerified: 'purchase/verified',
                purchaseCancel: 'purchase/cancel'
            }
        },
        rest: {
            tutoringPackages: {
                listPackages: 'tutoring-package',
                packageDetail: 'tutoring-package',
                addPackage: 'tutoring-package',
                updatePackage: 'tutoring-package',
                deletePackage: 'tutoring-package'
            }

        }
    },
    exam: {
        client: {
            schedule: {
                listExam: 'schedules/list',
                detailExam: 'schedules/:id/form-register',
                listOwnedExam: 'schedules/owned',
                register: 'schedules/:id/registration'
            },
            exam: {
                getAttachment: 'schedules/:scheduleID/exam/:registerID/attachment',
                getListExamQuestion: 'schedules/:scheduleID/exam/:registerID/question'
            }
        }
    },
    payment: {
        claim: 'claim',
        purchase: 'purchases'
    }
}
