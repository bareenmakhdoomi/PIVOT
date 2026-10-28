import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    'acl-assessment-create-row-admin': {
                        table: 'sys_security_acl'
                        id: '17d96932a7404fe2a9596a136892ceb4'
                    }
                    'acl-assessment-delete-row-admin': {
                        table: 'sys_security_acl'
                        id: 'c75cf76346f140af8208fe7307c3a043'
                    }
                    'acl-assessment-read-all-viewer': {
                        table: 'sys_security_acl'
                        id: '00d0d4cdf3454747b591d352e9f82a2f'
                    }
                    'acl-assessment-read-row-viewer': {
                        table: 'sys_security_acl'
                        id: 'cbba72d582a846469f62e9015b2d187f'
                    }
                    'acl-assessment-write-all-admin': {
                        table: 'sys_security_acl'
                        id: '0e86f0b98024403cbe75bb2f146741d6'
                    }
                    'acl-assessment-write-row-admin': {
                        table: 'sys_security_acl'
                        id: '10103b60366840a68b0e0da6f583b88f'
                    }
                    'acl-business_outcome-create-row-admin': {
                        table: 'sys_security_acl'
                        id: '457c93877e14474ebd34de5374d045ed'
                    }
                    'acl-business_outcome-create-row-business_owner': {
                        table: 'sys_security_acl'
                        id: 'ce91d3d26e2245de8e12d62f2c7e8af1'
                    }
                    'acl-business_outcome-delete-row-admin': {
                        table: 'sys_security_acl'
                        id: 'ac55b66b4aad44d0a05bf74cbbf147f8'
                    }
                    'acl-business_outcome-read-all-viewer': {
                        table: 'sys_security_acl'
                        id: 'c1912bb4471144bebccd7a1ac734c071'
                    }
                    'acl-business_outcome-read-row-viewer': {
                        table: 'sys_security_acl'
                        id: '5e290efe18834bab892703b2903c6463'
                    }
                    'acl-business_outcome-write-all-admin': {
                        table: 'sys_security_acl'
                        id: '05688a7c39e940cca3f201d0cd030918'
                    }
                    'acl-business_outcome-write-all-business_owner': {
                        table: 'sys_security_acl'
                        id: '4fa195125cbf400d9cb9ee86ec24de6b'
                    }
                    'acl-business_outcome-write-baseline_change_reason-admin': {
                        table: 'sys_security_acl'
                        id: 'ed7d876b35f74cbba813c3d522fe7ec0'
                    }
                    'acl-business_outcome-write-baseline-admin': {
                        table: 'sys_security_acl'
                        id: '5d9616d438e446baa65ddefeac4aef8a'
                    }
                    'acl-business_outcome-write-baseline-owner-first': {
                        table: 'sys_security_acl'
                        id: 'b82216fbdaef49ddaa92376a7fd661ad'
                    }
                    'acl-business_outcome-write-row-admin': {
                        table: 'sys_security_acl'
                        id: '629bb89e79314948adb13a306010213a'
                    }
                    'acl-business_outcome-write-row-business_owner': {
                        table: 'sys_security_acl'
                        id: '2a7d78a4d4c3480a888cc6e3879506b0'
                    }
                    'acl-capability-create-row-admin': {
                        table: 'sys_security_acl'
                        id: '2b15e729f2f44e45a6d3f004d61f19a3'
                    }
                    'acl-capability-delete-row-admin': {
                        table: 'sys_security_acl'
                        id: '9e6c995a6092430b8fcd0522e78723e0'
                    }
                    'acl-capability-read-all-viewer': {
                        table: 'sys_security_acl'
                        id: 'b67ed4f353f2441f9cebef81021cc8c2'
                    }
                    'acl-capability-read-row-viewer': {
                        table: 'sys_security_acl'
                        id: '9459356932284b5eaaffee7a118a05db'
                    }
                    'acl-capability-write-all-admin': {
                        table: 'sys_security_acl'
                        id: 'b3ac89fbee13428cbc6f5a7994649bc7'
                    }
                    'acl-capability-write-row-admin': {
                        table: 'sys_security_acl'
                        id: '2eda6f44eb774a979ea80b253d1e95a4'
                    }
                    'acl-opportunity-create-row-admin': {
                        table: 'sys_security_acl'
                        id: '985e2ff30af54c3a9bd12a852227b584'
                    }
                    'acl-opportunity-delete-row-admin': {
                        table: 'sys_security_acl'
                        id: 'af23eaf9824c4f5e94270aece40489eb'
                    }
                    'acl-opportunity-read-all-viewer': {
                        table: 'sys_security_acl'
                        id: '1e5d41bb7ce241cfa2ab1117d11a2e1b'
                    }
                    'acl-opportunity-read-row-viewer': {
                        table: 'sys_security_acl'
                        id: 'de0011943c6f4ed1b844bd993ec57f18'
                    }
                    'acl-opportunity-write-activity_log-analyst': {
                        table: 'sys_security_acl'
                        id: 'b8d79ea1547b4f729cd8146df6e010d8'
                    }
                    'acl-opportunity-write-all-admin': {
                        table: 'sys_security_acl'
                        id: '80e181c6cae340728bab7951a2fa1835'
                    }
                    'acl-opportunity-write-assigned_to-analyst': {
                        table: 'sys_security_acl'
                        id: '73da4f7aff874f27af2a37d5d9c78355'
                    }
                    'acl-opportunity-write-business_impact-analyst': {
                        table: 'sys_security_acl'
                        id: 'cffd163ef0ec46b8b88fb9deff50cf57'
                    }
                    'acl-opportunity-write-effort-analyst': {
                        table: 'sys_security_acl'
                        id: '47abc4826488489ab0721945c68e50d5'
                    }
                    'acl-opportunity-write-priority_reason-analyst': {
                        table: 'sys_security_acl'
                        id: '29348502442d427fb13385cf1586df73'
                    }
                    'acl-opportunity-write-priority-analyst': {
                        table: 'sys_security_acl'
                        id: '87c39790dbd64befbf004905042c2d56'
                    }
                    'acl-opportunity-write-rejection_reason-analyst': {
                        table: 'sys_security_acl'
                        id: '5b07cebe9d1e437496ed6af6865d2af3'
                    }
                    'acl-opportunity-write-row-admin': {
                        table: 'sys_security_acl'
                        id: '40ac70a690de4c9b81392cd34dc49219'
                    }
                    'acl-opportunity-write-row-analyst': {
                        table: 'sys_security_acl'
                        id: 'cef961ac9d944f02a24d9a9d1dd507a7'
                    }
                    'acl-opportunity-write-state-analyst': {
                        table: 'sys_security_acl'
                        id: '1a5b0fc90671489fac5352751156e921'
                    }
                    'acl-opportunity-write-value-analyst': {
                        table: 'sys_security_acl'
                        id: '7c5687f89e074649aceb09bd60b8dbdc'
                    }
                    'acl-outcome_result-create-row-admin': {
                        table: 'sys_security_acl'
                        id: '79bb2eea4792453cbea0426ca176ce4d'
                    }
                    'acl-outcome_result-delete-row-admin': {
                        table: 'sys_security_acl'
                        id: '1ce896f1970842de9147724f87859dce'
                    }
                    'acl-outcome_result-read-all-viewer': {
                        table: 'sys_security_acl'
                        id: '0a2080f1c987495faafd3b87a37bf6fd'
                    }
                    'acl-outcome_result-read-row-viewer': {
                        table: 'sys_security_acl'
                        id: 'fe45d00e54cc4a36b43ac4874a9f5f8a'
                    }
                    'acl-outcome_result-write-all-admin': {
                        table: 'sys_security_acl'
                        id: '024c76b01b4e4f1f80639e8a3741aaa1'
                    }
                    'acl-outcome_result-write-row-admin': {
                        table: 'sys_security_acl'
                        id: '5d4bc96700534e01be0bb29fd9c620af'
                    }
                    'acl-rest-workspace': {
                        table: 'sys_security_acl'
                        id: 'f7e586e453f24710bb2c6efcec936c86'
                    }
                    'acl-result-create-row-admin': {
                        table: 'sys_security_acl'
                        id: 'ebde995a006b48e8a40f0fb480e418bc'
                    }
                    'acl-result-delete-row-admin': {
                        table: 'sys_security_acl'
                        id: 'bc956af67d2949e0a70e56cbacf79e9a'
                    }
                    'acl-result-read-all-viewer': {
                        table: 'sys_security_acl'
                        id: 'd3e28829ee06403ea4e71b844c74cdde'
                    }
                    'acl-result-read-row-viewer': {
                        table: 'sys_security_acl'
                        id: '17d7ca6f34684a07ad119c448f575f87'
                    }
                    'acl-result-write-all-admin': {
                        table: 'sys_security_acl'
                        id: 'e65984205aff4cb295e3d587223d21d8'
                    }
                    'acl-result-write-row-admin': {
                        table: 'sys_security_acl'
                        id: '4b39eaf4b35f43288f635cc783040e2f'
                    }
                    'acl-roadmap_item-create-row-admin': {
                        table: 'sys_security_acl'
                        id: '60a69210d9f448f0823f50c4596b1193'
                    }
                    'acl-roadmap_item-delete-row-admin': {
                        table: 'sys_security_acl'
                        id: '93d5df8b80a74fd98b90bc0769a6b47b'
                    }
                    'acl-roadmap_item-read-all-viewer': {
                        table: 'sys_security_acl'
                        id: 'e5b3708402674be298b836ac8f0dbdfb'
                    }
                    'acl-roadmap_item-read-row-viewer': {
                        table: 'sys_security_acl'
                        id: '3ad6932c6ad2476f9070bdfa1282b78b'
                    }
                    'acl-roadmap_item-write-all-admin': {
                        table: 'sys_security_acl'
                        id: '3ac3423752ee45998ebe9dac2a45d3d8'
                    }
                    'acl-roadmap_item-write-row-admin': {
                        table: 'sys_security_acl'
                        id: '67c591f2d3ef4ad3aeb72d470a885cb4'
                    }
                    'acl-roadmap_item-write-row-analyst': {
                        table: 'sys_security_acl'
                        id: '769f6ca86abc46c495700c86cffcaafc'
                    }
                    'acl-roadmap_item-write-sequence-analyst': {
                        table: 'sys_security_acl'
                        id: 'f590dd1b5b2c4bc5992a70300a401246'
                    }
                    'assessment-related-list-outcome-results': {
                        table: 'sys_ui_related_list_entry'
                        id: 'f5aef0cb02854d2d9d7729ba556c99ed'
                    }
                    'assessment-related-list-results': {
                        table: 'sys_ui_related_list_entry'
                        id: '36cb39bf949a462abec8dd61e3590fb0'
                    }
                    'assessment-related-lists': {
                        table: 'sys_ui_related_list'
                        id: '7317b793ed73456e8276478a6a11223d'
                    }
                    'atf-assessment-run': {
                        table: 'sys_atf_test'
                        id: '00baa202b31546329a931136feb0f392'
                    }
                    'atf-assessment-run-step': {
                        table: 'sys_atf_step'
                        id: '70f532acab9e4593b78a4f29619d5326'
                    }
                    'atf-baseline-lock': {
                        table: 'sys_atf_test'
                        id: 'cc6dbae28789404e879e8907c0b41833'
                    }
                    'atf-baseline-lock-setup': {
                        table: 'sys_atf_step'
                        id: 'b1369cb979dc46b38cd9beca4b6f2899'
                    }
                    'atf-baseline-lock-try': {
                        table: 'sys_atf_step'
                        id: 'c5a209b603754636b967bf54573ddc56'
                    }
                    'atf-baseline-lock-user': {
                        table: 'sys_atf_step'
                        id: 'c78765c4e89f44dea6a1e3adb5917c48'
                    }
                    'atf-scoring-rules': {
                        table: 'sys_atf_test'
                        id: '58caa09b0a7947e7afea99a5c128a567'
                    }
                    'atf-scoring-rules-step': {
                        table: 'sys_atf_step'
                        id: '7514885695154efe9994185045e461f1'
                    }
                    bom_json: {
                        table: 'sys_module'
                        id: 'f0918765f8b240bf92054b27586857dd'
                    }
                    'br-assessment-validate': {
                        table: 'sys_script'
                        id: '54ce3ae748e34ce9873510a7189e8fee'
                    }
                    'br-capability-validate': {
                        table: 'sys_script'
                        id: 'd675635953714c45a6b4cca42127f7fd'
                    }
                    'br-opportunity-priority': {
                        table: 'sys_script'
                        id: 'e255a198aab74d1591028a0e125f3ac4'
                    }
                    'br-outcome-baseline-lock': {
                        table: 'sys_script'
                        id: 'bd119d2057534c34a236d8ae25879806'
                    }
                    'br-result-validate': {
                        table: 'sys_script'
                        id: '9c8e70fe0b03450fb5abe25da3b08fed'
                    }
                    'br-roadmap-item-defaults-display': {
                        table: 'sys_script'
                        id: '99aab20322ea49b292d5c4d7dcc690ce'
                    }
                    'br-roadmap-item-defaults-insert': {
                        table: 'sys_script'
                        id: 'ebf6caf8d566419aafa590e3c9ae815e'
                    }
                    'br-roadmap-item-validate': {
                        table: 'sys_script'
                        id: '990301d7687845f3911975cdc39da7a9'
                    }
                    'capability-related-list-outcomes': {
                        table: 'sys_ui_related_list_entry'
                        id: '99baa950b2e9457ba5c1fe1b6126269d'
                    }
                    'capability-related-lists': {
                        table: 'sys_ui_related_list'
                        id: 'f1c3f75c4e554e5393151dfa4b41d5fe'
                    }
                    'opportunity-related-list-roadmap-items': {
                        table: 'sys_ui_related_list_entry'
                        id: '3b37b036b8aa451cb1aa137b6a9c8794'
                    }
                    'opportunity-related-lists': {
                        table: 'sys_ui_related_list'
                        id: '96a24aab77db4eeca7fe6bc7d796d4e7'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '96a7857d9dc642e591d1491c9aa06c55'
                    }
                    'pivot-job-assessment': {
                        table: 'sysauto_script'
                        id: 'b70d15fc93ef47a2b7f3af55a10f6e0e'
                    }
                    'pivot-job-discovery': {
                        table: 'sysauto_script'
                        id: 'f61e02c0b75f4981ac9c9ca4599c40c5'
                    }
                    'pivot-menu': {
                        table: 'sys_app_application'
                        id: 'b8acb94ad60b40e4b42fffad35af63d2'
                    }
                    'pivot-module-assessments': {
                        table: 'sys_app_module'
                        id: 'cee5dcc815eb48298face1806b65c2f4'
                    }
                    'pivot-module-cap-apps': {
                        table: 'sys_app_module'
                        id: '6b6b648a2bb44867bc9e7bb88c75d027'
                    }
                    'pivot-module-cap-licences': {
                        table: 'sys_app_module'
                        id: '473ea2cca2eb427d83497149ff7cc864'
                    }
                    'pivot-module-cap-not-found': {
                        table: 'sys_app_module'
                        id: '420407ced50648009ba5ad960addce3a'
                    }
                    'pivot-module-cap-plugins': {
                        table: 'sys_app_module'
                        id: '925d9697a86c4debaece93c933df0507'
                    }
                    'pivot-module-capabilities': {
                        table: 'sys_app_module'
                        id: 'b00f167d2b854011a41b5f7c34982e9c'
                    }
                    'pivot-module-needs-mapping': {
                        table: 'sys_app_module'
                        id: 'ad4315a2e9ed4b85a8fb133bca52bcf0'
                    }
                    'pivot-module-opportunities': {
                        table: 'sys_app_module'
                        id: '765feb17c5eb4243811fbe4a22607636'
                    }
                    'pivot-module-outcomes': {
                        table: 'sys_app_module'
                        id: '3872b3d04cc349df8739e2587e85db35'
                    }
                    'pivot-module-properties': {
                        table: 'sys_app_module'
                        id: '121ffc02c2e74189a612caaa80105bb1'
                    }
                    'pivot-module-setup-separator': {
                        table: 'sys_app_module'
                        id: '1d53f750b68947c7988d9cb6e5a451ae'
                    }
                    'pivot-module-workspace': {
                        table: 'sys_app_module'
                        id: '5702a5181e094ead967f169e2ea7f8de'
                    }
                    'pivot-portal': {
                        table: 'sp_portal'
                        id: '0fe1a93559c44ef2858726304563daaf'
                    }
                    'pivot-portal-dependency': {
                        table: 'sp_dependency'
                        id: 'daa1773daabd4aa4a8b946497aa4e1ae'
                        deleted: true
                    }
                    'pivot-portal-home-column': {
                        table: 'sp_column'
                        id: '37161d0e2cdc47deb8a2bd066bffa579'
                    }
                    'pivot-portal-home-container': {
                        table: 'sp_container'
                        id: 'f6852e36670e4b58bab1e14d2e07c491'
                    }
                    'pivot-portal-home-instance': {
                        table: 'sp_instance'
                        id: 'fb96e32061a1425d9ac9283b9945d80b'
                    }
                    'pivot-portal-home-row': {
                        table: 'sp_row'
                        id: 'ccddd46c42d64d5a9218512233216058'
                    }
                    'pivot-portal-js-include': {
                        table: 'sp_js_include'
                        id: '84560a97bd294bf4ac9f669705444cf1'
                        deleted: true
                    }
                    'pivot-portal-theme': {
                        table: 'sp_theme'
                        id: '29b04d787025485d80834d4ec0c1ee89'
                    }
                    'pivot-portal-ui-script': {
                        table: 'sys_ui_script'
                        id: 'f756837d8f324af9bfc13f7052815019'
                    }
                    'pivot-portal-widget': {
                        table: 'sp_widget'
                        id: 'ac2a1900921f428095c7612d05d17f9e'
                    }
                    'pivot-workspace-page-read': {
                        table: 'sys_security_acl'
                        id: 'dab42fddd09945d9a3df99fac83d0e53'
                    }
                    'pivot-xscope-read-alm_asset': {
                        table: 'sys_scope_privilege'
                        id: '523b152a2fcc1310d2a0d68fcea4e3a0'
                    }
                    'pivot-xscope-read-cab_meeting': {
                        table: 'sys_scope_privilege'
                        id: '9a3b152a2fcc1310d2a0d68fcea4e3b0'
                    }
                    'pivot-xscope-read-change_request': {
                        table: 'sys_scope_privilege'
                        id: '9e3b152a2fcc1310d2a0d68fcea4e3bd'
                    }
                    'pivot-xscope-read-em_alert': {
                        table: 'sys_scope_privilege'
                        id: '223b552a2fcc1310d2a0d68fcea4e309'
                    }
                    'pivot-xscope-read-incident': {
                        table: 'sys_scope_privilege'
                        id: 'ae3b552a2fcc1310d2a0d68fcea4e31d'
                    }
                    'pivot-xscope-read-license_details': {
                        table: 'sys_scope_privilege'
                        id: '8a326d50948546cbacd1efdde4f608d7'
                    }
                    'pivot-xscope-read-pm_project': {
                        table: 'sys_scope_privilege'
                        id: '223b552a2fcc1310d2a0d68fcea4e357'
                    }
                    'pivot-xscope-read-problem': {
                        table: 'sys_scope_privilege'
                        id: '263b552a2fcc1310d2a0d68fcea4e34b'
                    }
                    'pivot-xscope-read-resource_plan': {
                        table: 'sys_scope_privilege'
                        id: '2a3b552a2fcc1310d2a0d68fcea4e380'
                    }
                    'pivot-xscope-read-rm_story': {
                        table: 'sys_scope_privilege'
                        id: '5a3b152a2fcc1310d2a0d68fcea4e37f'
                    }
                    'pivot-xscope-read-sc_req_item': {
                        table: 'sys_scope_privilege'
                        id: '2a3b552a2fcc1310d2a0d68fcea4e38c'
                    }
                    'pivot-xscope-read-sn_customerservice_case': {
                        table: 'sys_scope_privilege'
                        id: 'e23b152a2fcc1310d2a0d68fcea4e3f5'
                    }
                    'pivot-xscope-read-sn_sub_man_st_subscription_overview': {
                        table: 'sys_scope_privilege'
                        id: 'a1aa6f0e2f885750d2a0d68fcea4e396'
                    }
                    'pivot-xscope-read-subscription_entitlement': {
                        table: 'sys_scope_privilege'
                        id: '29c4ac5f8c864d7c810b9acd2a07d4e5'
                    }
                    'pivot-xscope-read-sys_cs_conversation': {
                        table: 'sys_scope_privilege'
                        id: '623b552a2fcc1310d2a0d68fcea4e3e3'
                    }
                    'pivot-xscope-read-sys_store_app': {
                        table: 'sys_scope_privilege'
                        id: '61aa6f0e2f885750d2a0d68fcea4e3f3'
                    }
                    'pivot-xscope-read-time_card': {
                        table: 'sys_scope_privilege'
                        id: 'e63b552a2fcc1310d2a0d68fcea4e3cd'
                    }
                    'pivot-xscope-read-ua_app_family': {
                        table: 'sys_scope_privilege'
                        id: '9b4189c139254b6c8c0a0dfd7d0b357a'
                    }
                    'pivot-xscope-read-v_plugin': {
                        table: 'sys_scope_privilege'
                        id: '7269194580be4710942668b20e89a522'
                    }
                    'pivot/pivot.css': {
                        table: 'sys_ux_theme_asset'
                        id: '511202a25bf14cf6b9e3eb75bacdf477'
                        deleted: true
                    }
                    'pivot\\pivot.css': {
                        table: 'sys_ux_theme_asset'
                        id: 'ab86356ae8b84fbe9bbf4a796e633176'
                        deleted: true
                    }
                    'prop-admin-group': {
                        table: 'sys_properties'
                        id: '69dd49f414cc4241b0fa39cd4eeaa52a'
                    }
                    'prop-ai-enabled': {
                        table: 'sys_properties'
                        id: '5191e83369374a71a22419bbe44a76dc'
                    }
                    'prop-default-days-back': {
                        table: 'sys_properties'
                        id: '9675569430f344d2b05f4dfcb699420e'
                    }
                    'prop-high-usage-threshold': {
                        table: 'sys_properties'
                        id: 'fd33216e85e843428ad3b841477afc22'
                    }
                    'prop-low-score-threshold': {
                        table: 'sys_properties'
                        id: 'ea412c0a31a242f5a275d91fdadd4d6d'
                    }
                    'prop-max-run-minutes': {
                        table: 'sys_properties'
                        id: '7f30b70502b14f79b6373487f76459b6'
                    }
                    'prop-priority-next': {
                        table: 'sys_properties'
                        id: '32b04a75c6614f73a135462aa0303f1e'
                    }
                    'prop-priority-now': {
                        table: 'sys_properties'
                        id: 'bd5e5652c4814fa995d6a96976a282f9'
                    }
                    'prop-slow-capability-seconds': {
                        table: 'sys_properties'
                        id: '10709f890d7b4405ae0fd1bf3c2ced54'
                    }
                    'prop-timing-log': {
                        table: 'sys_properties'
                        id: '6c438e088bff456a83b2631500e5e6c8'
                    }
                    'prop-utilization-threshold': {
                        table: 'sys_properties'
                        id: '9a8a67cc1bd946dbaf2b046290ab5cd0'
                    }
                    'rest-workspace': {
                        table: 'sys_ws_definition'
                        id: 'e1ad4de5cc504c4c863cb089f11bae0b'
                    }
                    'rest-workspace-action': {
                        table: 'sys_ws_operation'
                        id: 'c6f51455e87949778165821f6527e162'
                    }
                    'rest-workspace-bootstrap': {
                        table: 'sys_ws_operation'
                        id: 'cf4ffbad96224c04959edbbc3a65195e'
                    }
                    'rest-workspace-v1': {
                        table: 'sys_ws_version'
                        id: '717724673d7a462d8ff814105000cea9'
                    }
                    src_server_pivot_assessment_ts: {
                        table: 'sys_module'
                        id: 'cb1759e39e104df69041b9681b8d5198'
                    }
                    'src_server_pivot_business-rules_ts': {
                        table: 'sys_module'
                        id: '427376b9d32c4976ad703910ffe0c806'
                    }
                    src_server_pivot_discovery_ts: {
                        table: 'sys_module'
                        id: 'fbe2069723db4c049fefbad765de4bce'
                    }
                    src_server_pivot_rules_ts: {
                        table: 'sys_module'
                        id: 'de182cb60ab14d978a24810611df0066'
                    }
                    'src_server_pivot_workspace-api_ts': {
                        table: 'sys_module'
                        id: '487af0a88f9640e9bb6cc1a995fbc57b'
                    }
                }
                composite: [
                    {
                        table: 'sys_documentation'
                        id: '0070333e74f54d72b6ae04f55c182ecb'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'version'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '00b6e026c1cf4e73b1b6523130f77f9b'
                        key: {
                            sys_ui_section: {
                                id: 'ef6064c403be43adb2f001ea5d0dcd79'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Business outcome'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'capability'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '00f25f402d804c1bb253d503e6910a6e'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'log'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '021acb59890d45f0b25e1c68275987bb'
                        key: {
                            sys_security_acl: '3ad6932c6ad2476f9070bdfa1282b78b'
                            sys_user_role: {
                                id: '6956f4c54234436d86b317b5d18a6db7'
                                key: {
                                    name: 'x_enno_pivot.viewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '0249ca9a84e24d4992234a0267b12643'
                        key: {
                            sys_security_acl: 'f590dd1b5b2c4bc5992a70300a401246'
                            sys_user_role: {
                                id: 'e034e3e1405040a28970a9b4310b9f2c'
                                key: {
                                    name: 'x_enno_pivot.analyst'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '0263cbecec47436986a7a14afaf27ceb'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '02c626988edf4ea3a585218fb6feacba'
                        key: {
                            sys_ui_section: {
                                id: '8c68cb6bbb904e73b0c8786676a8b79d'
                                key: {
                                    name: 'x_enno_pivot_roadmap_item'
                                    caption: 'Roadmap item'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'assessment'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '032b4c510fd74b01b1a59a2af5c1a556'
                        key: {
                            name: 'x_enno_pivot_result'
                            caption: 'Result'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '03b99126e3f44403b0df3efc08938050'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'status'
                            value: 'queued'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '042bc8e98d6541d0bed79be235b28d8d'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'baseline_change_reason'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '044767136a624a4f9866886e78310b95'
                        key: {
                            sys_ui_section: {
                                id: '6fb51fcd30af420ab2e53fffefe82133'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '04910f419beb44d6936b76d6d8312963'
                        key: {
                            document_key: 'c78765c4e89f44dea6a1e3adb5917c48'
                            variable: '8c07aba5ff6033008d3f5d9ad53bf13b'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '04c6adc0e59d4a9ba144c3a0b0040dac'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'entitled_count'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '04d1933d93cf4037ac3eae32f9b93aa0'
                        key: {
                            sys_ui_section: {
                                id: '904abf0012e344ebb2fd4f645b7a7b4a'
                                key: {
                                    name: 'x_enno_pivot_opportunity'
                                    caption: 'Opportunity'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'type'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '05048dfd871a49328a68292cb933a0a5'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'sys_domain'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '053e6a95844849fe9309eaf2ea7b8d9b'
                        key: {
                            sys_ui_section: {
                                id: '032b4c510fd74b01b1a59a2af5c1a556'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'licensed'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '059337bdf7454366bff83a69d2fab5b4'
                        key: {
                            sys_ui_section: {
                                id: '904abf0012e344ebb2fd4f645b7a7b4a'
                                key: {
                                    name: 'x_enno_pivot_opportunity'
                                    caption: 'Opportunity'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'sys_domain'
                            position: '10'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '05b28365b32346a3a4b968c1f0ff3916'
                        key: {
                            name: 'x_enno_pivot_roadmap_item'
                            element: 'sequence'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '05be8dfac12a4671b395f484011b9bf6'
                        key: {
                            sys_ui_section: {
                                id: '6c681e552bae4f43a898db7fce627e42'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'duration_ms'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '08ad2809fe454e82bc3fc606394f2316'
                        key: {
                            list_id: {
                                id: 'e48c60cc2751480bb903419efcbbedf5'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'current_value'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '096e9e93f9f547d8880f54314de7c3cc'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'activity_log'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '0a6f91df74b7416b9539001b4e85e1db'
                        key: {
                            sys_ui_section: {
                                id: 'ef6064c403be43adb2f001ea5d0dcd79'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Business outcome'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '0a76b4db9eff42dd818c17ca08e52bee'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'source'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '0aca4fc8244547a29f05ea98aa156311'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '032b4c510fd74b01b1a59a2af5c1a556'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '13'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '0c49c5bbd1ee4b4fb7c181dc9427245b'
                        key: {
                            sys_ui_section: {
                                id: '904abf0012e344ebb2fd4f645b7a7b4a'
                                key: {
                                    name: 'x_enno_pivot_opportunity'
                                    caption: 'Opportunity'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'outcome'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '0ce956fb9bd749569867f0f4e665e8e5'
                        key: {
                            sys_ui_section: {
                                id: '9893ab8b4c0f4065a1dc669ab2610139'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'KPI filter and baseline change'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'baseline_change_reason'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0d28ddabac0e484faf138488baf9a2c0'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'expected_benefit'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0d3165d041564980aea4745e929250e9'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'source_id'
                        }
                    },
                    {
                        table: 'sys_ui_list'
                        id: '0d8334e93d19412983871dd305e346de'
                        key: {
                            name: 'x_enno_pivot_roadmap_item'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                            element: 'NULL'
                            relationship: 'NULL'
                            parent: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0df1d53aa57c4855bd2068eef935f63b'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'assigned_to'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '0e02ed9558ab43d28d6625f0bae596cf'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'status'
                            value: 'on_target'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0edfecf0450949cc881bdda2efcebc2d'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'kpi_filter'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0ee1c93f4a6f4d96a6e9549f0dfe0415'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'important_objective'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '0eec949402784fc9bc004833d8df6110'
                        key: {
                            sys_security_acl: '17d7ca6f34684a07ad119c448f575f87'
                            sys_user_role: {
                                id: '6956f4c54234436d86b317b5d18a6db7'
                                key: {
                                    name: 'x_enno_pivot.viewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0f074ae56fb6402fb4559077f8da6997'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'over_allocated'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '0f25fcf80838467cb5952aeb8071b923'
                        key: {
                            list_id: {
                                id: 'ccafeb6c34d4466ab3d3165272fcf75c'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'name'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '0f84d9d7fcf94e33a228d46d6634594a'
                        key: {
                            sys_ui_section: {
                                id: 'd6297d80f1f645a3bd446ee6e34b2712'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'kpi_aggregate'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '0fdc5462cda34728953c9d46fa0ca79d'
                        key: {
                            sys_ui_section: {
                                id: '8c68cb6bbb904e73b0c8786676a8b79d'
                                key: {
                                    name: 'x_enno_pivot_roadmap_item'
                                    caption: 'Roadmap item'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'phase'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '103e3bc9356d48809d25ef82fa30be48'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '108c396798444317a10142ce0bad3d05'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'current_value'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1099083467b14dd28ac09baa0cea47e7'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'number'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '10c18001e6f748a38f18e7f97c9c14a4'
                        key: {
                            sys_ui_section: {
                                id: '032b4c510fd74b01b1a59a2af5c1a556'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '10cdba73e10f4fa4b26b457bb6c41a16'
                        key: {
                            sys_ui_section: {
                                id: '6fb51fcd30af420ab2e53fffefe82133'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '10ce561458974911916dfe7efb5a3036'
                        key: {
                            sys_security_acl: 'dab42fddd09945d9a3df99fac83d0e53'
                            sys_user_role: {
                                id: '6956f4c54234436d86b317b5d18a6db7'
                                key: {
                                    name: 'x_enno_pivot.viewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '10da67ca15eb4eaebe573414ed026fe7'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'installed'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '10ea4ccf16a849aabab1ffa913fa0790'
                        key: {
                            sys_ui_form: {
                                id: 'a1e0af27431548b3a2014c67d60dd471'
                                key: {
                                    name: 'x_enno_pivot_outcome_result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: 'f990e296cccb426c8142d7a74a3d0971'
                                key: {
                                    name: 'x_enno_pivot_outcome_result'
                                    caption: 'Outcome result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '110359a6a38f4727911812b7e18fcbe1'
                        key: {
                            sys_ui_form: {
                                id: '846a959731af48888ad7ecaee2c78c36'
                                key: {
                                    name: 'x_enno_pivot_opportunity'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '904abf0012e344ebb2fd4f645b7a7b4a'
                                key: {
                                    name: 'x_enno_pivot_opportunity'
                                    caption: 'Opportunity'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '11331c1b050e49aab4f6399493e9820b'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'manual_value_date'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '113a9a7e520545c0829e7ceb3cdda307'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'status'
                            value: 'improved'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '11f46f5bbd97437abaa62d45c7b9b6cd'
                        key: {
                            sys_security_acl: '10103b60366840a68b0e0da6f583b88f'
                            sys_user_role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '1232d6bfdd924c8c940078591f6403ac'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'product_family'
                            value: 'itom'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '1332e9aced2440ed88095b8409ab9465'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'measurement_type'
                            value: 'manual'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1358f9be0a284a37aa2e8146153c4d78'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'assessment'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1365ff1e5ff24d53b76a6a80ae49edc8'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'measure_table'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '13ab72b947634fba827605dab3ab689e'
                        key: {
                            sys_security_acl: '73da4f7aff874f27af2a37d5d9c78355'
                            sys_user_role: {
                                id: 'e034e3e1405040a28970a9b4310b9f2c'
                                key: {
                                    name: 'x_enno_pivot.analyst'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '144bba769f5441efb29b03e0dfbae8c8'
                        key: {
                            sys_ui_form: {
                                id: '61378ed7b388487ea9944946f4304792'
                                key: {
                                    name: 'x_enno_pivot_roadmap_item'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '8c68cb6bbb904e73b0c8786676a8b79d'
                                key: {
                                    name: 'x_enno_pivot_roadmap_item'
                                    caption: 'Roadmap item'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '15732f3af07e4bcdbd53a8715f65b4d2'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'product_family'
                            value: 'csm'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '15936a8c48584e28b98b811f79c02e6e'
                        key: {
                            sys_ui_section: {
                                id: '46678275426f4072bffcf0b67c787263'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Capability'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '12'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '15cddd3c12f746b2be659bd63eab0a59'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'not_found'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '15dc16aa616d4f2fa9f7bd41b050f23e'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'assessment'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '16a39b49756d47098724d172771b9e06'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'product_family'
                            value: 'secops'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '16cc4ec1019c41de8f900fa1d4713475'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '032b4c510fd74b01b1a59a2af5c1a556'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'reason'
                            position: '11'
                        }
                    },
                    {
                        table: 'm2m_sp_widget_dependency'
                        id: '16fad516c4b94537947db503750aa20f'
                        deleted: true
                        key: {
                            sp_widget: 'ac2a1900921f428095c7612d05d17f9e'
                            sp_dependency: 'daa1773daabd4aa4a8b946497aa4e1ae'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '16fdac0760e04bf48148b4382d311135'
                        key: {
                            document_key: 'c5a209b603754636b967bf54573ddc56'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '177cb23f2d714b9b95d3aac41cf8efcb'
                        key: {
                            name: 'x_enno_pivot_outcome_result'
                            element: 'outcome_status'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '189c20927757451aa878890b9a433060'
                        key: {
                            sys_security_acl: 'ac55b66b4aad44d0a05bf74cbbf147f8'
                            sys_user_role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '1933064cdf90482eb7a0e7aa60812c9d'
                        key: {
                            sys_ui_section: {
                                id: 'ef6064c403be43adb2f001ea5d0dcd79'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Business outcome'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'status'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '1935a6b8c28e4ed58b48c3fa99ac9eaf'
                        key: {
                            sys_security_acl: 'c75cf76346f140af8208fe7307c3a043'
                            sys_user_role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '1a5bd93522e64522913435dd00594c05'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'kpi_aggregate'
                        }
                    },
                    {
                        table: 'sys_number'
                        id: '1ad8f7edf983412b8679068fe40591d6'
                        key: {
                            category: 'x_enno_pivot_assessment'
                            prefix: 'PVA'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '1ae6776fa1a04a41a88cce9276256b60'
                        key: {
                            sys_security_acl: 'f7e586e453f24710bb2c6efcec936c86'
                            sys_user_role: {
                                id: '6956f4c54234436d86b317b5d18a6db7'
                                key: {
                                    name: 'x_enno_pivot.viewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '1afed2bc37314ce9b2a67ed4326473d9'
                        key: {
                            id: 'b1369cb979dc46b38cd9beca4b6f2899'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            field: 'script'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '1b0715cb36d648c5abfd637e2aa12015'
                        key: {
                            sys_ui_section: {
                                id: '5a8c6a83e3c145c5916a2044d0c6fa69'
                                key: {
                                    name: 'x_enno_pivot_assessment'
                                    caption: 'Assessment'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '1bafa237bb0c4d1e89acce482d31fecf'
                        key: {
                            document_key: 'c78765c4e89f44dea6a1e3adb5917c48'
                            variable: '98c44875ffa033008d3f5d9ad53bf1fa'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '1c0c6726de3241bab1c7f104c2624786'
                        key: {
                            sys_ui_section: {
                                id: 'a75ecfbb27f54f0fb4dde7a7183e1815'
                                key: {
                                    name: 'x_enno_pivot_assessment'
                                    caption: 'Run summary'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '1c5676d4c7d1448abad89f66c51f9e15'
                        key: {
                            sys_ui_form: {
                                id: '846a959731af48888ad7ecaee2c78c36'
                                key: {
                                    name: 'x_enno_pivot_opportunity'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '760c4e015ceb45999b4ea4b5f246effb'
                                key: {
                                    name: 'x_enno_pivot_opportunity'
                                    caption: 'Decision'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '1c8df78d675842fe93312a43dda2dd63'
                        key: {
                            list_id: {
                                id: 'c8f1ea41dbff4a3ea2a307984c962c5e'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'actual_value'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1ccac237121144318c811fb773fbfb99'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'active'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '1cd3731255b1431b91bb02d912296db8'
                        key: {
                            sys_ui_section: {
                                id: '5bd62381046c4b169f9aff0f63d685d5'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Discovery'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1cf6130e967348d7ae5e6127bd98f65d'
                        key: {
                            name: 'x_enno_pivot_outcome_result'
                            element: 'actual'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '1d0ad2b71a6a4a8db1ea8da6aa64beab'
                        key: {
                            name: 'x_enno_pivot_outcome_result'
                            element: 'outcome_status'
                            value: 'below_target'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '1d3c241511a5456096ed10bacfb8b81c'
                        key: {
                            sys_ui_form: {
                                id: '932fd5545ee34303a4e104b524e39ba2'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '46678275426f4072bffcf0b67c787263'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Capability'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '1d88cc6aa51e4bf9b944314e0e7d21e4'
                        key: {
                            sys_security_acl: 'de0011943c6f4ed1b844bd993ec57f18'
                            sys_user_role: {
                                id: '6956f4c54234436d86b317b5d18a6db7'
                                key: {
                                    name: 'x_enno_pivot.viewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '1da3601dd93340b5ba79124b8e083333'
                        key: {
                            sys_security_acl: '457c93877e14474ebd34de5374d045ed'
                            sys_user_role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '1eac493824014964a627391371107d74'
                        key: {
                            list_id: {
                                id: 'e48c60cc2751480bb903419efcbbedf5'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'measurement_type'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1edeffc884314765a4b1ec5749fe2c01'
                        key: {
                            name: 'x_enno_pivot_outcome_result'
                            element: 'target'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '1f4c6a51d5f14b44ac5a6851054a03df'
                        key: {
                            list_id: {
                                id: 'ccafeb6c34d4466ab3d3165272fcf75c'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'active'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '1fffc1e123444b9cb41af431eb02790c'
                        key: {
                            sys_ui_section: {
                                id: 'f990e296cccb426c8142d7a74a3d0971'
                                key: {
                                    name: 'x_enno_pivot_outcome_result'
                                    caption: 'Outcome result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'target'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '206bcb90f25a4ce48aa76506a1e7add2'
                        key: {
                            sys_security_acl: '80e181c6cae340728bab7951a2fa1835'
                            sys_user_role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '208f7b4774244d50a756931150e42e3a'
                        key: {
                            sys_ui_form: {
                                id: '32d9016fff064a15a90e57cf1fd52cc5'
                                key: {
                                    name: 'x_enno_pivot_assessment'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '5a8c6a83e3c145c5916a2044d0c6fa69'
                                key: {
                                    name: 'x_enno_pivot_assessment'
                                    caption: 'Assessment'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '2115060408fd475c8e8ecc17d5b51819'
                        key: {
                            sys_ui_section: {
                                id: '904abf0012e344ebb2fd4f645b7a7b4a'
                                key: {
                                    name: 'x_enno_pivot_opportunity'
                                    caption: 'Opportunity'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '21805e20db984469b6556754d053a4c8'
                        key: {
                            sys_ui_section: {
                                id: 'ef6064c403be43adb2f001ea5d0dcd79'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Business outcome'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'low_volume_expected'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '21cea725d3e544689ef36cd13117a3e3'
                        key: {
                            sys_ui_section: {
                                id: '6fb51fcd30af420ab2e53fffefe82133'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'weight'
                            position: '6'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '21e4c2deb39e4ab2a803990d6a35f1a9'
                        key: {
                            name: 'x_enno_pivot_assessment'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '221a17d2c4064af493157d9e3a15ee5c'
                        key: {
                            sys_security_acl: '79bb2eea4792453cbea0426ca176ce4d'
                            sys_user_role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '222504d9f38d41eba266fc8cf116cdda'
                        key: {
                            sys_security_acl: '2eda6f44eb774a979ea80b253d1e95a4'
                            sys_user_role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '222fb241aea24d6cbe71e2081cff752d'
                        key: {
                            sys_security_acl: '4fa195125cbf400d9cb9ee86ec24de6b'
                            sys_user_role: {
                                id: '522249df388c4eed9cd2569ff4faf273'
                                key: {
                                    name: 'x_enno_pivot.business_owner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2274f17c3c084504a61b0118e33d4286'
                        key: {
                            name: 'x_enno_pivot_roadmap_item'
                            element: 'phase'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '22804bde0cd84d3f9e47734635dd7ebb'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'assessment'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '22a488c033de4472ab5aea0fb5106d70'
                        key: {
                            sys_security_acl: '7c5687f89e074649aceb09bd60b8dbdc'
                            sys_user_role: {
                                id: 'e034e3e1405040a28970a9b4310b9f2c'
                                key: {
                                    name: 'x_enno_pivot.analyst'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '22beaf595e9d4e69976ac8a625739291'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'entitled_count'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '2342c66c650b41eda6d6ffa5f113ef88'
                        key: {
                            sys_ui_section: {
                                id: '8c68cb6bbb904e73b0c8786676a8b79d'
                                key: {
                                    name: 'x_enno_pivot_roadmap_item'
                                    caption: 'Roadmap item'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'opportunity'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '237d72e4d5164d4e8400cb54990d975e'
                        key: {
                            document_key: 'c78765c4e89f44dea6a1e3adb5917c48'
                            variable: 'b27b2b29ff6033008d3f5d9ad53bf164'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '2386178426974a868b7b684d8ea7efd9'
                        key: {
                            sys_ui_form: {
                                id: 'd8c4cc50fe254b92a24d7f4977bf48b5'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: 'cb50c08c10e74c0490783a8aa93c32e8'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Objective'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '238a5704c1124c3fa84246c60d5442cc'
                        key: {
                            list_id: {
                                id: '0d8334e93d19412983871dd305e346de'
                                key: {
                                    name: 'x_enno_pivot_roadmap_item'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'assessment'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '24881bdfb63e478ea9c4a1041eedfd99'
                        key: {
                            list_id: {
                                id: '295e2d3db62a46a0ba104345faa2bfa9'
                                key: {
                                    name: 'x_enno_pivot_outcome_result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'actual'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '25801180e0a04db1ab723e0d48d26d94'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '262be20736b6487db62cdcd469eb7534'
                        key: {
                            sys_ui_section: {
                                id: '6c681e552bae4f43a898db7fce627e42'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '26ce07a7bdc043eeb0999ac5a54decc9'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'priority_reason'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '2799883efcbe46918954d6277d0610d8'
                        key: {
                            sys_security_acl: '40ac70a690de4c9b81392cd34dc49219'
                            sys_user_role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '27b3b641d0884a5183b4f7b65a2364c7'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'kpi_aggregate'
                            value: 'avg'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '27bc242684fc46f5aae16cfecc29775d'
                        key: {
                            sys_ui_section: {
                                id: '5dd1ffafdb9340e08d66b47cc4ffb58f'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Manual value'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'manual_value'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '27d62737a62a440bab28144eb2b67d66'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'kpi_field'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '287669a7eb674168844d92819a33f59b'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'actual_value'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2891ca9a816949edabd2ce33b1774f61'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'sys_domain'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '28d153957f8942feb65266bf5c38df71'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'manual_value'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '28f1edec28fc4f01a65aed73f4c0f68e'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'slow_count'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '2956f8527c144bd591ff2c02115dc82a'
                        key: {
                            sys_ui_section: {
                                id: 'd6297d80f1f645a3bd446ee6e34b2712'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '10'
                        }
                    },
                    {
                        table: 'sys_ui_list'
                        id: '295e2d3db62a46a0ba104345faa2bfa9'
                        key: {
                            name: 'x_enno_pivot_outcome_result'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                            element: 'NULL'
                            relationship: 'NULL'
                            parent: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '2a8285c7169347dda2816e317968a150'
                        key: {
                            sys_security_acl: '0e86f0b98024403cbe75bb2f146741d6'
                            sys_user_role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2b414d90d32d40448d8073462c742524'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'kpi_aggregate'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2b6c70e5710749bd80117687fb240885'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'measurement_type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '2b6e2649f97c49a78cefd905a63f6e36'
                        key: {
                            sys_security_acl: '1ce896f1970842de9147724f87859dce'
                            sys_user_role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2caec63cf1ba464b9a864238d168b998'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'source_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2d332499a83b4f198e2609dbe4e5d177'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'effort'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '2d5f4dc43f5147cca90648dbf82e9458'
                        key: {
                            list_id: {
                                id: 'b5e117f4ae4d462ba27b610b2d92b5a0'
                                key: {
                                    name: 'x_enno_pivot_assessment'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'number'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '2d7b865a062a40128bfb0c13710ffe60'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '5bd62381046c4b169f9aff0f63d685d5'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Discovery'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'sys_domain'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '2dde4d5fe43144598a07154ac39df46a'
                        key: {
                            sys_security_acl: '47abc4826488489ab0721945c68e50d5'
                            sys_user_role: {
                                id: 'e034e3e1405040a28970a9b4310b9f2c'
                                key: {
                                    name: 'x_enno_pivot.analyst'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '2df4f6cd13e64e9c94ea7e742e203412'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'period'
                            value: 'quarterly'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '2e1b8b8a27fa419d8c3a598409ee687c'
                        key: {
                            sys_security_acl: 'b82216fbdaef49ddaa92376a7fd661ad'
                            sys_user_role: {
                                id: '522249df388c4eed9cd2569ff4faf273'
                                key: {
                                    name: 'x_enno_pivot.business_owner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '2e32d181ab3948cfa671fefe4c293301'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'measurement_status'
                            value: 'measured'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2e64c572f1ab4095a4c3200b8e72e5ca'
                        key: {
                            name: 'x_enno_pivot_roadmap_item'
                            element: 'opportunity'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2e844e5432a54334ad2417eaa194a51c'
                        key: {
                            name: 'x_enno_pivot_outcome_result'
                            element: 'outcome_status'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2ea4ba111a89400abea29fae8764931c'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'sys_domain'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2ecff1d53f0440fd8d630b781c5746d0'
                        key: {
                            name: 'x_enno_pivot_roadmap_item'
                            element: 'phase'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '2faac2a010dc4ee2bf57b5b22e29f3d4'
                        key: {
                            sys_ui_section: {
                                id: '5bd62381046c4b169f9aff0f63d685d5'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Discovery'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'last_discovered'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '31256594a815412686e3606e88d63ce1'
                        key: {
                            sys_ui_section: {
                                id: '5bd62381046c4b169f9aff0f63d685d5'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Discovery'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'linked_app'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '313ab174985c40d392512b491489715d'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'weight'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '32367984df4f4dd4b4905cc1d9f2f346'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'state'
                            value: 'open'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '326fd2ba29974ea4909afa3844eb8e69'
                        key: {
                            sys_ui_section: {
                                id: 'f990e296cccb426c8142d7a74a3d0971'
                                key: {
                                    name: 'x_enno_pivot_outcome_result'
                                    caption: 'Outcome result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '32c16383862c47d6a135da3c3a603f0d'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'reason'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '32c699eec9e34a27a76e40b3af4f6507'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'priority'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: '32d9016fff064a15a90e57cf1fd52cc5'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '32dc013b4055460185138d8895997b12'
                        key: {
                            sys_ui_section: {
                                id: '5bd62381046c4b169f9aff0f63d685d5'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Discovery'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'source_id'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3323ad2fbe764ccb9dd9db5e4427a5ee'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'state'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '33bfe9972a7f4d0ea5d9e8e4cc1a838e'
                        key: {
                            name: 'x_enno_pivot_roadmap_item'
                            element: 'sequence'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '344e6e2ecd3043298655a8e4630bf584'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '6fb51fcd30af420ab2e53fffefe82133'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '348427a6c3f04dddafcd2e4f41470d21'
                        key: {
                            document_key: 'b1369cb979dc46b38cd9beca4b6f2899'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '34e9185477264a7994ffb40bee8e4c27'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'measure_table'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '358c03eb43674d4dbccfb08332b46a51'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'outcome'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '35f40ecfe9a0410bb7efffe44fb25cc5'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            caption: 'Log'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '36b748d39a714a7fb7a461a023a24849'
                        key: {
                            name: 'x_enno_pivot_outcome_result'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '36f8beb1191243078796600f19a5f03d'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'type'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '36fc6c3ca41d4b04aec28863e16af970'
                        key: {
                            sys_ui_section: {
                                id: 'd6297d80f1f645a3bd446ee6e34b2712'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '37260a55220c418398cc5235ec275101'
                        key: {
                            name: 'x_enno_pivot_roadmap_item'
                            element: 'assessment'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3736d577fd2f47cf9c7cad7af091b57d'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'measure_filter'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '38146be5953e439e92ff0d7e492dd4e7'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'activity_log'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '38fb9042be5946febdc55fca348c6969'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'slow_count'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3901901d36b74d0884c77422db7475c2'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'owner'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '394718f8416040bfbe8b057cb0234885'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'capability'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '398684777e9c48dfb3d28a38fc2e24b6'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'rejection_reason'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '3997ad0569b64889a52e38ab87fe36aa'
                        key: {
                            sys_ui_section: {
                                id: '5a8c6a83e3c145c5916a2044d0c6fa69'
                                key: {
                                    name: 'x_enno_pivot_assessment'
                                    caption: 'Assessment'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'status'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '39f73a6628734cf5bd5909cdfab7efce'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'scored_count'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '3a251478fb25483f932a426904f778f2'
                        key: {
                            sys_ui_section: {
                                id: '5dd1ffafdb9340e08d66b47cc4ffb58f'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Manual value'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '3a26e2cb68ad40d2aa5e4d2e981f1bb2'
                        key: {
                            list_id: {
                                id: '295e2d3db62a46a0ba104345faa2bfa9'
                                key: {
                                    name: 'x_enno_pivot_outcome_result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'improvement_pct'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '3a73d255a6264549930ed45a6cc0e4af'
                        key: {
                            sys_security_acl: '67c591f2d3ef4ad3aeb72d470a885cb4'
                            sys_user_role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3af0792215cf4c989c816c6ac468f9ff'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'inactive_count'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3b185aded77c4735be9085c6d3507f44'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '3b54a8094bb44692bdd95e0f116f4913'
                        key: {
                            sys_security_acl: '0a2080f1c987495faafd3b87a37bf6fd'
                            sys_user_role: {
                                id: '6956f4c54234436d86b317b5d18a6db7'
                                key: {
                                    name: 'x_enno_pivot.viewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '3baa4fb7dab34db8aacf0e8f654c4da3'
                        key: {
                            list_id: {
                                id: '295e2d3db62a46a0ba104345faa2bfa9'
                                key: {
                                    name: 'x_enno_pivot_outcome_result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'baseline'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '3bd4f2edbfca44048be29f1436d7a884'
                        key: {
                            sys_security_acl: 'bc956af67d2949e0a70e56cbacf79e9a'
                            sys_user_role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '3c157155bfec41d7a3340f8c731b3d51'
                        key: {
                            id: '70f532acab9e4593b78a4f29619d5326'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            field: 'script'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '3c39cb2a0f804c6ca902dd1bbfbabc59'
                        key: {
                            name: 'x_enno_pivot_capability'
                            caption: 'Measurement filter'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3ca8b0e0cebd45319445504b3afba280'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'source'
                            value: 'manual'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '3d10560202514229afd265272d5c2159'
                        key: {
                            sys_ui_section: {
                                id: '9893ab8b4c0f4065a1dc669ab2610139'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'KPI filter and baseline change'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'sys_domain'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3d8ea788929e4fef99ddd6c80a600d86'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'status'
                            value: 'running'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3d968ff269fc4b7786523bde97218fe4'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'seed_applied'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3ddf6a6ad9df4e19bfa2e0ff1533ecee'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'type'
                            value: 'low_adoption'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3e0393e9ea55484ea44f3d5285ca413a'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'product_family'
                            value: 'hrsd'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3e25c68d8f714987b13e0cb23700de20'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'weight'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '3e57cc638a084269992b79752e06cabd'
                        key: {
                            list_id: {
                                id: '0d8334e93d19412983871dd305e346de'
                                key: {
                                    name: 'x_enno_pivot_roadmap_item'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'sequence'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '3e86f8fcd7634fbc8eb4ef2195c4cfc6'
                        key: {
                            sys_ui_section: {
                                id: '904abf0012e344ebb2fd4f645b7a7b4a'
                                key: {
                                    name: 'x_enno_pivot_opportunity'
                                    caption: 'Opportunity'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'capability'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '3f432e9199054e3785ace8da9a53908f'
                        key: {
                            list_id: {
                                id: 'e48c60cc2751480bb903419efcbbedf5'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3fbead586dfe4bf9a16f8324dc6fa81d'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'weight'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '40a216f3632149a6b21704f20d0f8b89'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'assessment'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '417a4ac05f3c4b3da428dfe78dd62e49'
                        key: {
                            name: 'x_enno_pivot_roadmap_item'
                            element: 'phase'
                            value: 'later'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '41dfc08959aa48ee8958819673b57d49'
                        key: {
                            name: 'x_enno_pivot_outcome_result'
                            element: 'sys_domain'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '424ebfd941764e0ab182c9337a764afb'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'kpi_field'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_policy_action'
                        id: '427ad4a503084c5492f886b4bcf19b12'
                        key: {
                            ui_policy: {
                                id: 'a58b49ef735f4d71a304e5ab270490bb'
                                key: {
                                    table: 'x_enno_pivot_business_outcome'
                                    short_description: 'PIVOT – Manual KPI: value and date are required, calculation fields hidden'
                                }
                            }
                            field: 'kpi_table'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '43c146af473a472fbe39aa0a0d656e0f'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'kpi_aggregate'
                            value: 'sum'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '43e4a046125a453da3a09b88d9cd487d'
                        key: {
                            sys_ui_section: {
                                id: '46678275426f4072bffcf0b67c787263'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Capability'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '4472b236084547c38e31bf6dda7c1241'
                        key: {
                            sys_ui_section: {
                                id: 'f990e296cccb426c8142d7a74a3d0971'
                                key: {
                                    name: 'x_enno_pivot_outcome_result'
                                    caption: 'Outcome result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'baseline'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '44a03eb8dda446f29475dcbb7810dc7e'
                        key: {
                            sys_ui_section: {
                                id: '5a8c6a83e3c145c5916a2044d0c6fa69'
                                key: {
                                    name: 'x_enno_pivot_assessment'
                                    caption: 'Assessment'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '44ad455fc66c45e3a0dbb7b03456640d'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'period'
                            value: 'monthly'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '454f5c995b734e8bbc1e2e267f0a73b7'
                        key: {
                            sys_ui_section: {
                                id: '032b4c510fd74b01b1a59a2af5c1a556'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'measurement_status'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_ui_policy_action'
                        id: '460c61d1f27d4ed59cdb9bb4257eb118'
                        key: {
                            ui_policy: {
                                id: 'becea799583a4850b6228de6f0bc7063'
                                key: {
                                    table: 'x_enno_pivot_business_outcome'
                                    short_description: 'PIVOT – Calculated KPI: table required, manual value hidden'
                                }
                            }
                            field: 'manual_value'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '4615564ca34f41569006d9a03e8968b1'
                        key: {
                            sys_ui_section: {
                                id: '032b4c510fd74b01b1a59a2af5c1a556'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'installed'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '466423b26be043e58b1f77bf51086802'
                        key: {
                            sys_ui_form: {
                                id: 'd8c4cc50fe254b92a24d7f4977bf48b5'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '5dd1ffafdb9340e08d66b47cc4ffb58f'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Manual value'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4667168eaeca473aab390e7496464ef3'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'business_impact'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '46678275426f4072bffcf0b67c787263'
                        key: {
                            name: 'x_enno_pivot_capability'
                            caption: 'Capability'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '469ed18e4859406481f8f11e3cebeed2'
                        key: {
                            sys_ui_section: {
                                id: '904abf0012e344ebb2fd4f645b7a7b4a'
                                key: {
                                    name: 'x_enno_pivot_opportunity'
                                    caption: 'Opportunity'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'state'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '47328154a3a944af9a590e366b3c9635'
                        key: {
                            sys_ui_section: {
                                id: '6c681e552bae4f43a898db7fce627e42'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'filter_used'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4758e17e6a884fc19be1319f750c1ec1'
                        key: {
                            name: 'x_enno_pivot_outcome_result'
                            element: 'actual'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '481b51fd2ee945a780f6c67c859f01bb'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'installed'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '4849dd6059d04d14918fdbb8ecbb9099'
                        key: {
                            list_id: {
                                id: 'e48c60cc2751480bb903419efcbbedf5'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'kpi'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '48c09ce1d85e423cb9c7891ad4873c0a'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '032b4c510fd74b01b1a59a2af5c1a556'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'target_value'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '492b442e3aeb48e494e6a2e531f45afb'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'duration_ms'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '49a53dffe82945e7bc3f3f26393e2840'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            caption: 'Description'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '49b91dfe3ca743b58c613d988285ef41'
                        key: {
                            sys_ui_section: {
                                id: 'ef6064c403be43adb2f001ea5d0dcd79'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Business outcome'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'period'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4a3f226b037e4d06bbf2001602741d11'
                        key: {
                            name: 'x_enno_pivot_outcome_result'
                            element: 'baseline'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4a56622241c943dd93429098a4a7f7a9'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'capability'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '4adc903a301b43c4aaccd5d8ddbe05f3'
                        key: {
                            sys_security_acl: 'd3e28829ee06403ea4e71b844c74cdde'
                            sys_user_role: {
                                id: '6956f4c54234436d86b317b5d18a6db7'
                                key: {
                                    name: 'x_enno_pivot.viewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact'
                        id: '4b95afbf928f46e5b1b90f66da64c95d'
                        key: {
                            name: 'x_enno_pivot_workspace.do - BYOUI Files'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4bae068221c04c85b3157efb90da6ebc'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'duration_ms'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '4bc09d85134644619320a32baa9aeb9f'
                        key: {
                            list_id: {
                                id: '0d8334e93d19412983871dd305e346de'
                                key: {
                                    name: 'x_enno_pivot_roadmap_item'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'opportunity'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '4bf447beef204677befa1e91b1f2d5db'
                        key: {
                            sys_ui_section: {
                                id: '032b4c510fd74b01b1a59a2af5c1a556'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '4c07339655f3403c9abf0f290d89736e'
                        key: {
                            sys_ui_section: {
                                id: 'f990e296cccb426c8142d7a74a3d0971'
                                key: {
                                    name: 'x_enno_pivot_outcome_result'
                                    caption: 'Outcome result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'assessment'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '4c754fff40fc45eea945c25ed89d4b4f'
                        key: {
                            name: 'x_enno_pivot_roadmap_item'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4c9a9e0f0e2c423d96982e175a84d0f9'
                        key: {
                            name: 'x_enno_pivot_roadmap_item'
                            element: 'sys_domain'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_policy_action'
                        id: '4cea87aa48f84ce39a15f717f2866c5b'
                        key: {
                            ui_policy: {
                                id: 'c914ee7faff349f5980ce264585ac6c8'
                                key: {
                                    table: 'x_enno_pivot_business_outcome'
                                    short_description: 'PIVOT – Sum or average: the field to aggregate is required; hidden for count'
                                }
                            }
                            field: 'kpi_field'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4e18b3b9ec434e54878511a03abb3ded'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '4e647380664140c4941cc73dcb0d8d6a'
                        key: {
                            sys_security_acl: '3ac3423752ee45998ebe9dac2a45d3d8'
                            sys_user_role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '4edc8386fb7e480ca79356eb4ceb5f47'
                        key: {
                            sys_ui_section: {
                                id: 'ef6064c403be43adb2f001ea5d0dcd79'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Business outcome'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '4f559cb51470424fba24f1cd2109c423'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'state'
                            value: 'rejected'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '4ffb1e2dc7b54e0e8cae86e75d5a9c3d'
                        key: {
                            sys_ui_section: {
                                id: 'd6297d80f1f645a3bd446ee6e34b2712'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'measurement_type'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '5047d3889e744651ace21fc11ce1617c'
                        key: {
                            sys_ui_form: {
                                id: '32d9016fff064a15a90e57cf1fd52cc5'
                                key: {
                                    name: 'x_enno_pivot_assessment'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: 'a75ecfbb27f54f0fb4dde7a7183e1815'
                                key: {
                                    name: 'x_enno_pivot_assessment'
                                    caption: 'Run summary'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '5075618c16ca4604a21ea7146121b5d6'
                        key: {
                            name: 'x_enno_pivot_roadmap_item'
                            element: 'phase'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '50fd9161442a4a53bae26c1ee33631a7'
                        key: {
                            sys_ui_section: {
                                id: '032b4c510fd74b01b1a59a2af5c1a556'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'utilization'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '516944be042e47a8aa4f4bf04ab506f6'
                        key: {
                            sys_security_acl: '1e5d41bb7ce241cfa2ab1117d11a2e1b'
                            sys_user_role: {
                                id: '6956f4c54234436d86b317b5d18a6db7'
                                key: {
                                    name: 'x_enno_pivot.viewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: '522249df388c4eed9cd2569ff4faf273'
                        key: {
                            name: 'x_enno_pivot.business_owner'
                        }
                    },
                    {
                        table: 'sp_page'
                        id: '523f5a62e7914292af98eb6481348a63'
                        key: {
                            id: 'x_enno_pivot_home'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '52696a400a80455a97a6fc1d07c828c9'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            caption: 'Priority'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '526b9b82d7944e509a0d65563e963f7c'
                        key: {
                            name: 'x_enno_pivot_outcome_result'
                            element: 'target'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '5289c71d94ea4f379d7ec157b7c413a6'
                        key: {
                            sys_security_acl: '2b15e729f2f44e45a6d3f004d61f19a3'
                            sys_user_role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '52ad9d3028194592af8d118abc33da1f'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'sys_domain'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '52bba1d85ba1467eae75945359023b91'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'state'
                            value: 'accepted'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5344aa794abd4a11b2bb9e7901c86b55'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'run_by'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '535b1eef1f134c25a4b4d5927675fb74'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'score'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '53df92da94cd4d6e863e5393346eaff4'
                        key: {
                            sys_ui_form: {
                                id: '846a959731af48888ad7ecaee2c78c36'
                                key: {
                                    name: 'x_enno_pivot_opportunity'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '49a53dffe82945e7bc3f3f26393e2840'
                                key: {
                                    name: 'x_enno_pivot_opportunity'
                                    caption: 'Description'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '53f5e9d7d65b4f04a7bbe97c43eaab1c'
                        key: {
                            sys_ui_section: {
                                id: '032b4c510fd74b01b1a59a2af5c1a556'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'sys_domain'
                            position: '13'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '548f35f64ddd40a594a3a6ee532a5e15'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'number'
                        }
                    },
                    {
                        table: 'sys_ui_policy_action'
                        id: '54bb979c4bdd4ba9bc695dd2f5fd5cc0'
                        key: {
                            ui_policy: {
                                id: 'a58b49ef735f4d71a304e5ab270490bb'
                                key: {
                                    table: 'x_enno_pivot_business_outcome'
                                    short_description: 'PIVOT – Manual KPI: value and date are required, calculation fields hidden'
                                }
                            }
                            field: 'kpi_filter'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '54bc3336ab88470d8d8ba5e3bd9ff8ea'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'type'
                            value: 'not_measured'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '54c1f92e977b4fe9b82c2490cc9c5ac5'
                        key: {
                            sys_security_acl: '985e2ff30af54c3a9bd12a852227b584'
                            sys_user_role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '55d58c03d1124973a0440c8d71489bb2'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'measurement_type'
                            value: 'calculated'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5626fb1ef549476a892ea2fad6b4758a'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'date_field'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '5631e3669f6e4c92900c39678d56b630'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '56d3cf5ee0624c11bc556362b0e6d2e3'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'entitled_count'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '56e578f706f24511aa87c751cbdb8f4c'
                        key: {
                            sys_ui_section: {
                                id: '6fb51fcd30af420ab2e53fffefe82133'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'measure_table'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '56f2527e11b84e79b00ae45c1765c923'
                        key: {
                            sys_ui_section: {
                                id: '5a8c6a83e3c145c5916a2044d0c6fa69'
                                key: {
                                    name: 'x_enno_pivot_assessment'
                                    caption: 'Assessment'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'overall_score'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '57b0b4a01c0c42049176b03ddf38b640'
                        key: {
                            sys_security_acl: '769f6ca86abc46c495700c86cffcaafc'
                            sys_user_role: {
                                id: 'e034e3e1405040a28970a9b4310b9f2c'
                                key: {
                                    name: 'x_enno_pivot.analyst'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '57eeafc978e1469c9ac4b193cfef91c3'
                        key: {
                            name: 'x_enno_pivot_outcome_result'
                            element: 'sys_domain'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5851a0a5a4a548cab8beac5d7efce58f'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'trigger'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '58eac88dc49d4a17a2c0bd3c8dd186fb'
                        key: {
                            sys_security_acl: 'af23eaf9824c4f5e94270aece40489eb'
                            sys_user_role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '598f39029aac4d7193b74ea6691e6754'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'manual_value_by'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '5a6bbaa33b7548cfa0b8c03c01b685d6'
                        key: {
                            sys_security_acl: '5d4bc96700534e01be0bb29fd9c620af'
                            sys_user_role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '5a8c6a83e3c145c5916a2044d0c6fa69'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            caption: 'Assessment'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '5a9ec5222df44d74b5c0884a61b25c53'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '5bd62381046c4b169f9aff0f63d685d5'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Discovery'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '5bd62381046c4b169f9aff0f63d685d5'
                        key: {
                            name: 'x_enno_pivot_capability'
                            caption: 'Discovery'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5ccb0500209f47d99ebb8046f0aacc03'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '5cf82ac4a2944462af499e23846c6360'
                        key: {
                            sys_ui_section: {
                                id: '46678275426f4072bffcf0b67c787263'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Capability'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'entitled_count'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '5da99c38b71d4ff1816ee00dfb89c711'
                        key: {
                            sys_ui_section: {
                                id: '5a8c6a83e3c145c5916a2044d0c6fa69'
                                key: {
                                    name: 'x_enno_pivot_assessment'
                                    caption: 'Assessment'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'duration'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '5db1b641bca2497e9cedb8f32974efac'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'type'
                            value: 'adoption_potential'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '5dd1ffafdb9340e08d66b47cc4ffb58f'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            caption: 'Manual value'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '5e4f604837be469798a6bee4352fc065'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '032b4c510fd74b01b1a59a2af5c1a556'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'sys_domain'
                            position: '12'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5ee2e24160c544daa25e5e44ff6442e3'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'capability'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '5f632def6f2a499384aaa8f5a5c305a7'
                        key: {
                            sys_ui_section: {
                                id: '904abf0012e344ebb2fd4f645b7a7b4a'
                                key: {
                                    name: 'x_enno_pivot_opportunity'
                                    caption: 'Opportunity'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'assessment'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '601c3b53e57a4613bf74af31dc3b24d3'
                        key: {
                            name: 'x_enno_pivot_outcome_result'
                            element: 'reason'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '602b934dd26f460a88e1ba23d1b7f87c'
                        key: {
                            sys_security_acl: '4b39eaf4b35f43288f635cc783040e2f'
                            sys_user_role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '607772b7343b47d897137d536c933b40'
                        key: {
                            sys_security_acl: '9459356932284b5eaaffee7a118a05db'
                            sys_user_role: {
                                id: '6956f4c54234436d86b317b5d18a6db7'
                                key: {
                                    name: 'x_enno_pivot.viewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6123b96eed954918875a814e1de9734e'
                        key: {
                            name: 'x_enno_pivot_outcome_result'
                            element: 'improvement_pct'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: '61378ed7b388487ea9944946f4304792'
                        key: {
                            name: 'x_enno_pivot_roadmap_item'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '614af99f025a43b98f97cdd1abc2025d'
                        key: {
                            name: 'x_enno_pivot_result'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '614f4ff76f5f4f809f48f207b8c7c6b2'
                        key: {
                            sys_ui_section: {
                                id: '6fb51fcd30af420ab2e53fffefe82133'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'days_back'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '61856eb732a74cf1aeb7667e610dbd4a'
                        key: {
                            sys_ui_section: {
                                id: '5a8c6a83e3c145c5916a2044d0c6fa69'
                                key: {
                                    name: 'x_enno_pivot_assessment'
                                    caption: 'Assessment'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '10'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '61f28058ebe849e8a3f897093460b001'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'scored_count'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '6241b90c3b9c450e94e7a3bef42cfc1c'
                        key: {
                            sys_ui_section: {
                                id: '5bd62381046c4b169f9aff0f63d685d5'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Discovery'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'version'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '62656e2984f84f88b92d67cd197a4166'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'linked_app'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6293204579014f369e9673e21cc3938a'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'effort'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '62e4403c0c734746b6a94667f05321a7'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'licensed'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '62fdc349d5a0403c8c4f54351b01274a'
                        key: {
                            name: 'x_enno_pivot/main'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '6311679064814388b0915f147d7b74fa'
                        key: {
                            document_key: '7514885695154efe9994185045e461f1'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '631cbae0a1804e8a96fb547727ffa982'
                        key: {
                            name: 'x_enno_pivot_capability'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '63d8a0a1f1e74a489b9164ab46284b17'
                        key: {
                            sys_security_acl: 'e5b3708402674be298b836ac8f0dbdfb'
                            sys_user_role: {
                                id: '6956f4c54234436d86b317b5d18a6db7'
                                key: {
                                    name: 'x_enno_pivot.viewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '647c7b1a2fd9454d941db12006c6b005'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'kpi'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '64fe83e5ebd2493dac0f157b15327d2d'
                        key: {
                            sys_ui_section: {
                                id: '49a53dffe82945e7bc3f3f26393e2840'
                                key: {
                                    name: 'x_enno_pivot_opportunity'
                                    caption: 'Description'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'description'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6562262a0f094f458201891abc1af47f'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'outcome'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '66ce57c00193470bbf3fa0526bf57a45'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'capability'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '671c3b9b0f584162a22015d6099222a2'
                        key: {
                            sys_ui_section: {
                                id: '35f40ecfe9a0410bb7efffe44fb25cc5'
                                key: {
                                    name: 'x_enno_pivot_assessment'
                                    caption: 'Log'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'log'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6839b59e6ad5478c92384199d21162b5'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'state'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '68be93abb00b43d488e2e0dbcd63532b'
                        key: {
                            sys_ui_section: {
                                id: '5a8c6a83e3c145c5916a2044d0c6fa69'
                                key: {
                                    name: 'x_enno_pivot_assessment'
                                    caption: 'Assessment'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'trigger'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: '6956f4c54234436d86b317b5d18a6db7'
                        key: {
                            name: 'x_enno_pivot.viewer'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '698c7a3f0e6840afa2f79c813283aa8a'
                        key: {
                            sys_ui_section: {
                                id: '5dd1ffafdb9340e08d66b47cc4ffb58f'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Manual value'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '69c1284b597f4ddb82c62b972d6fd075'
                        key: {
                            list_id: {
                                id: 'ccafeb6c34d4466ab3d3165272fcf75c'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'installed'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '6a043305415748fd94add3e03cc2a3e7'
                        key: {
                            sys_ui_section: {
                                id: 'cb50c08c10e74c0490783a8aa93c32e8'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Objective'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'expected_benefit'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '6abbfd78ce2645fcbe52e3f173376c4f'
                        key: {
                            list_id: {
                                id: 'b5e117f4ae4d462ba27b610b2d92b5a0'
                                key: {
                                    name: 'x_enno_pivot_assessment'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '6c681e552bae4f43a898db7fce627e42'
                        key: {
                            name: 'x_enno_pivot_result'
                            caption: 'Measurement'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '6cb7ddc50d3c484981650cf92a1ae40b'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '032b4c510fd74b01b1a59a2af5c1a556'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'score'
                            position: '10'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '6d289c0145a6493a87c8631398862d16'
                        key: {
                            sys_ui_section: {
                                id: '5bd62381046c4b169f9aff0f63d685d5'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Discovery'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'sys_domain'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '6d517c9ab08b43b4bbdd53a17c7b9fc3'
                        key: {
                            document_key: '7514885695154efe9994185045e461f1'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '6d687b192f10449faa5ec60980cd494c'
                        key: {
                            sys_ui_section: {
                                id: '46678275426f4072bffcf0b67c787263'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Capability'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'source'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '6dcbfa50390643f9840db260c81da9bb'
                        key: {
                            sys_ui_section: {
                                id: '032b4c510fd74b01b1a59a2af5c1a556'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '14'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '6dd1347d66e14e1ebda49fa942d8800c'
                        key: {
                            name: 'x_enno_pivot_outcome_result'
                            element: 'outcome_status'
                            value: 'not_measured'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '6e14675c36474feb827fe154784897d0'
                        key: {
                            sys_security_acl: '024c76b01b4e4f1f80639e8a3741aaa1'
                            sys_user_role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6f015a443c4a4d73bc1ce3781f39125f'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'kpi_table'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '6f29b493b2ff4cefadf4f30db69a3cb1'
                        key: {
                            sys_ui_section: {
                                id: '46678275426f4072bffcf0b67c787263'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Capability'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'name'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '6fb51fcd30af420ab2e53fffefe82133'
                        key: {
                            name: 'x_enno_pivot_capability'
                            caption: 'Measurement'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '6fcb9f16add041e9a14f5112cc76bb42'
                        key: {
                            sys_ui_section: {
                                id: '6c681e552bae4f43a898db7fce627e42'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'days_back'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '70346a81eb5841a49f5c55a00b9d00d9'
                        key: {
                            sys_ui_section: {
                                id: '904abf0012e344ebb2fd4f645b7a7b4a'
                                key: {
                                    name: 'x_enno_pivot_opportunity'
                                    caption: 'Opportunity'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '703d511dcc364568abe54eb4a0c7d6ec'
                        key: {
                            sys_ui_form: {
                                id: 'd8c4cc50fe254b92a24d7f4977bf48b5'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '9893ab8b4c0f4065a1dc669ab2610139'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'KPI filter and baseline change'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '710528eaa6ab4b46be9ace559eb67415'
                        key: {
                            sys_ui_section: {
                                id: '032b4c510fd74b01b1a59a2af5c1a556'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'assessment'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '714a6d30e8a44c0ca8d0ba36a67185fb'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'measurement_type'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '71e24c0e784748aabea98859c0d028f6'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'objective'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '71f16a1072c4478486d9af6b5cdeb8fd'
                        key: {
                            sys_security_acl: 'c1912bb4471144bebccd7a1ac734c071'
                            sys_user_role: {
                                id: '6956f4c54234436d86b317b5d18a6db7'
                                key: {
                                    name: 'x_enno_pivot.viewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '72397c34898b467db88c3fd478c0c09d'
                        key: {
                            name: 'x_enno_pivot_roadmap_item'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '72c08404b7114d19910dcc5565029cac'
                        key: {
                            sys_ui_section: {
                                id: '8c68cb6bbb904e73b0c8786676a8b79d'
                                key: {
                                    name: 'x_enno_pivot_roadmap_item'
                                    caption: 'Roadmap item'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '7321b7b375a845179281eb4c8979c8fa'
                        key: {
                            sys_ui_section: {
                                id: '032b4c510fd74b01b1a59a2af5c1a556'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'weight'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '73ede1f5f23e42ad8ceb54e6d1445ed6'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'actual_value'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '75a1bd39236d4e17a6bb4af1010afe1c'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '032b4c510fd74b01b1a59a2af5c1a556'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'score'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_ui_policy_action'
                        id: '75fba15e1f984e5cb6399151fd21b74b'
                        key: {
                            ui_policy: {
                                id: 'a58b49ef735f4d71a304e5ab270490bb'
                                key: {
                                    table: 'x_enno_pivot_business_outcome'
                                    short_description: 'PIVOT – Manual KPI: value and date are required, calculation fields hidden'
                                }
                            }
                            field: 'manual_value_date'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '760c4e015ceb45999b4ea4b5f246effb'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            caption: 'Decision'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '76a0bacf6c324f9a937e23911cbaf6fc'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'target'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '778d72a23252469aa566d98a8bb48dcb'
                        key: {
                            sys_ui_section: {
                                id: '52696a400a80455a97a6fc1d07c828c9'
                                key: {
                                    name: 'x_enno_pivot_opportunity'
                                    caption: 'Priority'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '77e1a516b57542adb6c4a5c35f0224c6'
                        key: {
                            document_key: 'c78765c4e89f44dea6a1e3adb5917c48'
                            variable: '1985e0ceff2433008d3f5d9ad53bf1ba'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '77f9898713874f309a732ed9498015b0'
                        key: {
                            sys_ui_section: {
                                id: '46678275426f4072bffcf0b67c787263'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Capability'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'allocated_count'
                            position: '10'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '786198414b9644c18ad159fe1df8eb4f'
                        key: {
                            sys_ui_form: {
                                id: '32d9016fff064a15a90e57cf1fd52cc5'
                                key: {
                                    name: 'x_enno_pivot_assessment'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '35f40ecfe9a0410bb7efffe44fb25cc5'
                                key: {
                                    name: 'x_enno_pivot_assessment'
                                    caption: 'Log'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7879a6da8fd04e85abbb122b79f492ff'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '78cf532b522349e2870c97487dde7357'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'direction'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7924b598811243b1936e6380f4112674'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'allocated_count'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '795b2630885d4279a18c23b79363cc2b'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'over_allocated'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '7981791f4be14fedae9bb0bd61493ca9'
                        key: {
                            sys_ui_form: {
                                id: 'd8c4cc50fe254b92a24d7f4977bf48b5'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: 'd6297d80f1f645a3bd446ee6e34b2712'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '79ae1f10b9094fe28173533feb41d6c9'
                        key: {
                            sys_ui_form: {
                                id: '846a959731af48888ad7ecaee2c78c36'
                                key: {
                                    name: 'x_enno_pivot_opportunity'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '52696a400a80455a97a6fc1d07c828c9'
                                key: {
                                    name: 'x_enno_pivot_opportunity'
                                    caption: 'Priority'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7a59e3ffd23641198dfc521349137a03'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'duration'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7aab7edf446544d883a49a03b39c09fd'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'run_by'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7b051e6c44324ad9a29d476b6800b560'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '7b5d1bdafb234afc8b05241435333a8c'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'status'
                            value: 'not_measured'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7b70c4d9012a4a51945f7d57de7f74d1'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'not_measured_count'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7b7b8ad185ad4150830f564b06529f1a'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'linked_app'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '7b97c68e43d34d03a60a4234091a8cfd'
                        key: {
                            sys_security_acl: 'ce91d3d26e2245de8e12d62f2c7e8af1'
                            sys_user_role: {
                                id: '522249df388c4eed9cd2569ff4faf273'
                                key: {
                                    name: 'x_enno_pivot.business_owner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '7bc552926a7e4c948367afc3ce9ba1ee'
                        key: {
                            sys_security_acl: '9e6c995a6092430b8fcd0522e78723e0'
                            sys_user_role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '7d50930bd6434d17a7a941d5a2931c76'
                        key: {
                            sys_ui_section: {
                                id: '5dd1ffafdb9340e08d66b47cc4ffb58f'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Manual value'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'manual_value_date'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7d62564f57404cc7974fc7c3a2f4c5dc'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'duration'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7e514ce6a01f478f8ab10e0be0e350fa'
                        key: {
                            name: 'x_enno_pivot_outcome_result'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '7eac814f1cd5469faa824b41846f5ea0'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'direction'
                            value: 'higher_better'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '803bbf23660f4ded8af1797084f82b4d'
                        key: {
                            name: 'x_enno_pivot/main.js.map'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '804b938f9fdb441fad595131d01724ae'
                        key: {
                            sys_security_acl: '5d9616d438e446baa65ddefeac4aef8a'
                            sys_user_role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_user_role_contains'
                        id: '80b735cc3a67486daa0d67a1b0320468'
                        key: {
                            role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                            contains: {
                                id: '6956f4c54234436d86b317b5d18a6db7'
                                key: {
                                    name: 'x_enno_pivot.viewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '81400b5770504ec881bbebb93558147d'
                        key: {
                            sys_ui_section: {
                                id: 'ef6064c403be43adb2f001ea5d0dcd79'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Business outcome'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '10'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '81955ef6aca4434d9d41df235a64b320'
                        key: {
                            sys_ui_section: {
                                id: 'd6297d80f1f645a3bd446ee6e34b2712'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'target'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '821f4e8156ae49bda94e202f681efbe6'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'utilization'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '83919fde5df94b3a97d84dd79cc08aae'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'sys_domain'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '83af1d860cc4405baa3aa8fe0ba5f612'
                        key: {
                            sys_ui_section: {
                                id: '3c39cb2a0f804c6ca902dd1bbfbabc59'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Measurement filter'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'measure_filter'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '8454673867684e20b618cd197be9c0f9'
                        key: {
                            sys_ui_section: {
                                id: 'd6297d80f1f645a3bd446ee6e34b2712'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: '846a959731af48888ad7ecaee2c78c36'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '84a8c2135b8c4d30b44647f29365119a'
                        key: {
                            sys_ui_section: {
                                id: '5bd62381046c4b169f9aff0f63d685d5'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Discovery'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '855ca1fc5ef84bfe97345d5834394ad4'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'trigger'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '8620ed80ac1e4d3fa176167718d5e30b'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'state'
                            value: 'done'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '8657c8525f4f4a198c5fd14accbdd0cd'
                        key: {
                            document_key: '70f532acab9e4593b78a4f29619d5326'
                            variable: '989d9e235324220002c6435723dc3484'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '86e93492f4d14cceb83d852add5f05ae'
                        key: {
                            name: 'x_enno_pivot_outcome_result'
                            element: 'improvement_pct'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '871b1d1980c64ec09ca5281c623c4b4c'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '87a41ffdfa684361ad8a11c846d813f2'
                        key: {
                            sys_ui_section: {
                                id: '904abf0012e344ebb2fd4f645b7a7b4a'
                                key: {
                                    name: 'x_enno_pivot_opportunity'
                                    caption: 'Opportunity'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '11'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '87ac340af76e482f8f40a099f3a60880'
                        key: {
                            sys_security_acl: 'b67ed4f353f2441f9cebef81021cc8c2'
                            sys_user_role: {
                                id: '6956f4c54234436d86b317b5d18a6db7'
                                key: {
                                    name: 'x_enno_pivot.viewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '87f8029706a94856b511d5087c78eb3a'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'description'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: '880c5aefbd944d0e859436b9c23e8676'
                        key: {
                            name: 'x_enno_pivot_result'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '8aab3644229847fa8b5a3fb3555d4d97'
                        key: {
                            sys_security_acl: 'ebde995a006b48e8a40f0fb480e418bc'
                            sys_user_role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '8b2e71d03f0a4d8bab93276ca4e750a4'
                        key: {
                            name: 'x_enno_pivot_assessment'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '8b95924de3a74747ab3ce3882eaf4b44'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'product_family'
                            value: 'spm'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '8bdb226c47e34fcca9957e40482ad974'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'type'
                            value: 'idle_licences'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '8c68cb6bbb904e73b0c8786676a8b79d'
                        key: {
                            name: 'x_enno_pivot_roadmap_item'
                            caption: 'Roadmap item'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '8d528ca13fe24fefb1ee9f7dfc130d83'
                        key: {
                            sys_ui_form: {
                                id: '932fd5545ee34303a4e104b524e39ba2'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '5bd62381046c4b169f9aff0f63d685d5'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Discovery'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8d87db72007f4fc0ab11012d09762551'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'name'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '8d9abda576d44c0ea3a6f290bc26f979'
                        key: {
                            sys_security_acl: 'b8d79ea1547b4f729cd8146df6e010d8'
                            sys_user_role: {
                                id: 'e034e3e1405040a28970a9b4310b9f2c'
                                key: {
                                    name: 'x_enno_pivot.analyst'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '8e6ac6ae13aa4f60bc1181259354ec19'
                        key: {
                            list_id: {
                                id: '295e2d3db62a46a0ba104345faa2bfa9'
                                key: {
                                    name: 'x_enno_pivot_outcome_result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'outcome'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '8e8ae769e8a547e7ba00e9af4172f02c'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '6c681e552bae4f43a898db7fce627e42'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'utilization'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '8eaead187f2e44b2b19bc46e2ef0aff1'
                        key: {
                            document_key: 'c78765c4e89f44dea6a1e3adb5917c48'
                            variable: '1778a7480f20101091d0f00c97767e03'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '8f09acd99e584a7fb30f360fb4ad08e5'
                        key: {
                            sys_security_acl: 'e65984205aff4cb295e3d587223d21d8'
                            sys_user_role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8fb34b01049f4efc90a90d04d1e0b962'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'overall_score'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '901857db77bf4146ba21f8a0c6ac1a59'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'reason'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '902c9911100a4840bdfaef9af29ad339'
                        key: {
                            sys_ui_form: {
                                id: 'd8c4cc50fe254b92a24d7f4977bf48b5'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: 'ef6064c403be43adb2f001ea5d0dcd79'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Business outcome'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '904abf0012e344ebb2fd4f645b7a7b4a'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            caption: 'Opportunity'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '911fee113add4e77ad915c32e873b4a4'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'trigger'
                            value: 'run_now'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '920b21e51e9d4b0e92849915d88d3162'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'period'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '9219e87f374c455eba9376642238ec1c'
                        key: {
                            sys_ui_section: {
                                id: '52696a400a80455a97a6fc1d07c828c9'
                                key: {
                                    name: 'x_enno_pivot_opportunity'
                                    caption: 'Priority'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'value'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '929b476aa8d443bcbdc0c33055899e15'
                        key: {
                            sys_ui_section: {
                                id: '6c681e552bae4f43a898db7fce627e42'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '92a15e59583c40ec98f4989a80707e6d'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'number'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9311849b1af949ad9359d0cb7598dab2'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'days_back'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '932a85e38b4240d181500966643a8fa1'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'licensed'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: '932fd5545ee34303a4e104b524e39ba2'
                        key: {
                            name: 'x_enno_pivot_capability'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9353ac22989c4413b9669f961c968384'
                        key: {
                            name: 'x_enno_pivot_outcome_result'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '936bbda8e90b4d4daeeba5a6bd17c98e'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'status'
                            value: 'failed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '937603adef144b86ac92bc5525f253ca'
                        key: {
                            sys_security_acl: '29348502442d427fb13385cf1586df73'
                            sys_user_role: {
                                id: 'e034e3e1405040a28970a9b4310b9f2c'
                                key: {
                                    name: 'x_enno_pivot.analyst'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '93fe0ce7ca5b4447a2b59eafc1f384ad'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'direction'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '94ed5be4ea5646bea8054a54b27e3fbe'
                        key: {
                            sys_ui_section: {
                                id: '032b4c510fd74b01b1a59a2af5c1a556'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'actual_value'
                            position: '10'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '956418d08a8049d5a3e5579900d3741f'
                        key: {
                            name: 'x_enno_pivot_outcome_result'
                            element: 'baseline'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '95d495b8840740b986b3cd89e36496e9'
                        key: {
                            name: 'x_enno_pivot_roadmap_item'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '95e41ea651da41f3954a9a502e0fcf09'
                        key: {
                            sys_ui_section: {
                                id: 'a75ecfbb27f54f0fb4dde7a7183e1815'
                                key: {
                                    name: 'x_enno_pivot_assessment'
                                    caption: 'Run summary'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'not_measured_count'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '964d499d55cd41a6aabdb076b6353bbd'
                        key: {
                            name: 'x_enno_pivot_outcome_result'
                            element: 'assessment'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '967755e3ed6d42dfa1e129e6cb507b67'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '6c681e552bae4f43a898db7fce627e42'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'over_allocated'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9686824b63ca4db3a01e2c6bb1849256'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'allocated_count'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '96ab3865a21945b1ac4d4d84f3a04742'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'source'
                            value: 'store_app'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '96afd9860cc941fdbf5b1d564037ea03'
                        key: {
                            list_id: {
                                id: 'b5e117f4ae4d462ba27b610b2d92b5a0'
                                key: {
                                    name: 'x_enno_pivot_assessment'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'run_by'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '96db1283b4aa407787ce0d8be73f6cc9'
                        key: {
                            list_id: {
                                id: 'c8f1ea41dbff4a3ea2a307984c962c5e'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'capability'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '96f053fcf3464050a135ba5eae618d3c'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'measurement_type'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '97c3d962e13a46559b873af4eb5eb2a0'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '98019630aaad4a138fcd20372a5566f2'
                        key: {
                            document_key: 'c5a209b603754636b967bf54573ddc56'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '9893ab8b4c0f4065a1dc669ab2610139'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            caption: 'KPI filter and baseline change'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '98b47620a5854e6188b52962adc2ea41'
                        key: {
                            sys_ui_section: {
                                id: '904abf0012e344ebb2fd4f645b7a7b4a'
                                key: {
                                    name: 'x_enno_pivot_opportunity'
                                    caption: 'Opportunity'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'priority'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '98c2fd2bf234476e86106644eb4ff441'
                        key: {
                            sys_ui_section: {
                                id: '52696a400a80455a97a6fc1d07c828c9'
                                key: {
                                    name: 'x_enno_pivot_opportunity'
                                    caption: 'Priority'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'business_impact'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '98ceb6fe3ffb4c3dbcb3ed2b8beef268'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'type'
                            value: 'weak_outcome'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '991731befade45b08d4e6f31f30d6cdd'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'run_date'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '99514aae21124002ac7c1dc562eaa941'
                        key: {
                            list_id: {
                                id: 'c8f1ea41dbff4a3ea2a307984c962c5e'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'measurement_status'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '995d41941a6e47229c052973b66d913e'
                        key: {
                            sys_ui_section: {
                                id: 'f990e296cccb426c8142d7a74a3d0971'
                                key: {
                                    name: 'x_enno_pivot_outcome_result'
                                    caption: 'Outcome result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '10'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '99ab60a754bf4ca6bb45d2662202b295'
                        key: {
                            sys_security_acl: 'fe45d00e54cc4a36b43ac4874a9f5f8a'
                            sys_user_role: {
                                id: '6956f4c54234436d86b317b5d18a6db7'
                                key: {
                                    name: 'x_enno_pivot.viewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9a441bb795ee4406bac63a8c1b1d5db2'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'filter_used'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '9a5eacf8f7234b9288a153817707aed8'
                        key: {
                            sys_security_acl: '00d0d4cdf3454747b591d352e9f82a2f'
                            sys_user_role: {
                                id: '6956f4c54234436d86b317b5d18a6db7'
                                key: {
                                    name: 'x_enno_pivot.viewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9a7e1b8464a14ef6a3f15d9d88ddc7b7'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'target_value'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '9aba508512224cab9973b207cb19b8ab'
                        key: {
                            sys_ui_section: {
                                id: 'f990e296cccb426c8142d7a74a3d0971'
                                key: {
                                    name: 'x_enno_pivot_outcome_result'
                                    caption: 'Outcome result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'sys_domain'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '9ae38c9617504cf5821705b27e0c5911'
                        key: {
                            sys_ui_section: {
                                id: 'f990e296cccb426c8142d7a74a3d0971'
                                key: {
                                    name: 'x_enno_pivot_outcome_result'
                                    caption: 'Outcome result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'actual'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9b5b15912a9e484e8b2a33af26040ff5'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'trigger'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '9b68473417264a0cbe9e4afd1947b3e7'
                        key: {
                            sys_ui_form: {
                                id: '932fd5545ee34303a4e104b524e39ba2'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '6fb51fcd30af420ab2e53fffefe82133'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '9b8ea725cc61493ca610ae5248d44998'
                        key: {
                            sys_ui_section: {
                                id: '46678275426f4072bffcf0b67c787263'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Capability'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'active'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9cc471c77d56498db9ccf79a5b842d58'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'source'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '9dac7db183e64ed0bbd560f23ded09a4'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'measurement_status'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '9e29207601204dec8bb089adab023ef9'
                        key: {
                            sys_ui_section: {
                                id: 'a75ecfbb27f54f0fb4dde7a7183e1815'
                                key: {
                                    name: 'x_enno_pivot_assessment'
                                    caption: 'Run summary'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9e36b0d758814eff997b43f2ede424c4'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'licensed'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '9ef1e190cb6140cfa4b81c12ed28685d'
                        key: {
                            document_key: 'c78765c4e89f44dea6a1e3adb5917c48'
                            variable: 'ff06ab840f20101091d0f00c97767e6d'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '9f4c2c76c6d0450e9e06dfb7b64d27ff'
                        key: {
                            sys_ui_section: {
                                id: 'a75ecfbb27f54f0fb4dde7a7183e1815'
                                key: {
                                    name: 'x_enno_pivot_assessment'
                                    caption: 'Run summary'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '9fb617b3e56d4193ba3a8c776ca09862'
                        key: {
                            sys_ui_section: {
                                id: 'd6297d80f1f645a3bd446ee6e34b2712'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'baseline'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'a052794198f44742817a34658d71890a'
                        key: {
                            sys_ui_section: {
                                id: 'f990e296cccb426c8142d7a74a3d0971'
                                key: {
                                    name: 'x_enno_pivot_outcome_result'
                                    caption: 'Outcome result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a06d8e9bf1a34666859ca73a8416dd06'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'assigned_to'
                        }
                    },
                    {
                        table: 'sys_ui_policy_action'
                        id: 'a09e619a33294c77b3d0a4bcfea95f66'
                        key: {
                            ui_policy: {
                                id: 'becea799583a4850b6228de6f0bc7063'
                                key: {
                                    table: 'x_enno_pivot_business_outcome'
                                    short_description: 'PIVOT – Calculated KPI: table required, manual value hidden'
                                }
                            }
                            field: 'kpi_table'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a0fe4ae8041e4bd7be3981dac2c4dbc3'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'measure_filter'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'a118552664464315b9d6e10beac07225'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'product_family'
                            value: 'itsm'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: 'a1e0af27431548b3a2014c67d60dd471'
                        key: {
                            name: 'x_enno_pivot_outcome_result'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'a2fa3b79e7a84422b50c0df01bd803c4'
                        key: {
                            name: 'x_enno_pivot_outcome_result'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a368d1d36480411f8c63e3dc42ad8898'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'version'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a3a58c813c7f4c54adfefe14a4dad0c8'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'owner'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'a3c4f22c814442dbacdeca7bd13ebfa5'
                        key: {
                            sys_security_acl: 'cffd163ef0ec46b8b88fb9deff50cf57'
                            sys_user_role: {
                                id: 'e034e3e1405040a28970a9b4310b9f2c'
                                key: {
                                    name: 'x_enno_pivot.analyst'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a543c478537543e4b8a7e242b6cf4580'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'manual_value_by'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_policy'
                        id: 'a58b49ef735f4d71a304e5ab270490bb'
                        key: {
                            table: 'x_enno_pivot_business_outcome'
                            short_description: 'PIVOT – Manual KPI: value and date are required, calculation fields hidden'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a62d0de010fa41948cde26fd8fb95599'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'product_family'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a64fa80791ed4b20a27eb77cce1db0db'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a7198822394b401785526f2ae4a40304'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'baseline'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: 'a75ecfbb27f54f0fb4dde7a7183e1815'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            caption: 'Run summary'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'a7c6129672c145f59d44f0a5a467540d'
                        key: {
                            sys_security_acl: '87c39790dbd64befbf004905042c2d56'
                            sys_user_role: {
                                id: 'e034e3e1405040a28970a9b4310b9f2c'
                                key: {
                                    name: 'x_enno_pivot.analyst'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a7ef84606dd9447c81d8212b664ab1d7'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'value'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a80ef45d9a474cd6adbb30e0d5ed9b6a'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'business_impact'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a81327cfa9fd47298fea9925886683c7'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'period'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a8698abd18e2452793ed8b882e4fdfb2'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'target'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'a8859bbf8757418fb3b861f2435edf32'
                        key: {
                            sys_security_acl: '5b07cebe9d1e437496ed6af6865d2af3'
                            sys_user_role: {
                                id: 'e034e3e1405040a28970a9b4310b9f2c'
                                key: {
                                    name: 'x_enno_pivot.analyst'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'a889c0ab7fbb4924aba42378097bb038'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'direction'
                            value: 'lower_better'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_policy_action'
                        id: 'a938311be9344514a1d2816a7520a9c4'
                        key: {
                            ui_policy: {
                                id: 'becea799583a4850b6228de6f0bc7063'
                                key: {
                                    table: 'x_enno_pivot_business_outcome'
                                    short_description: 'PIVOT – Calculated KPI: table required, manual value hidden'
                                }
                            }
                            field: 'manual_value_date'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a948b5b34c4d4bdc99a0b104ff89d312'
                        key: {
                            name: 'x_enno_pivot_roadmap_item'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'aa82986b454645c5a78d121457a8db07'
                        key: {
                            sys_ui_section: {
                                id: 'd6297d80f1f645a3bd446ee6e34b2712'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'kpi_table'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'aa9ebaf17d0948ea8537df2a7b5912e2'
                        key: {
                            sys_security_acl: '2a7d78a4d4c3480a888cc6e3879506b0'
                            sys_user_role: {
                                id: '522249df388c4eed9cd2569ff4faf273'
                                key: {
                                    name: 'x_enno_pivot.business_owner'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'ab0501d97d934660a2fc628d98b7cc93'
                        key: {
                            sys_ui_section: {
                                id: '46678275426f4072bffcf0b67c787263'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Capability'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_user_role_contains'
                        id: 'ab125f3668f2439b81a823ae07e55ecf'
                        key: {
                            role: {
                                id: '522249df388c4eed9cd2569ff4faf273'
                                key: {
                                    name: 'x_enno_pivot.business_owner'
                                }
                            }
                            contains: {
                                id: '6956f4c54234436d86b317b5d18a6db7'
                                key: {
                                    name: 'x_enno_pivot.viewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ab38458d6b6a4e058dbeb1a2489166d7'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'days_back'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'abdd2c1edbc348f39f106f505306ed63'
                        key: {
                            sys_ui_section: {
                                id: '46678275426f4072bffcf0b67c787263'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Capability'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'product_family'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ac75dce931ce4d349af006a36363368a'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'kpi'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'acda0db1d5764e19a9ae06cb60cccf3c'
                        key: {
                            sys_ui_section: {
                                id: '6fb51fcd30af420ab2e53fffefe82133'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'date_field'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ad66e4b0e79640e9b04a0bd62bde2300'
                        key: {
                            name: 'x_enno_pivot_roadmap_item'
                            element: 'sys_domain'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'adbd87794c70416c86f339baebbd887d'
                        key: {
                            sys_security_acl: '93d5df8b80a74fd98b90bc0769a6b47b'
                            sys_user_role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'aec82a7e199b4268ac3db1ddf9672071'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'days_back'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'aece2aef38284e07b00d8152c7da5c66'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'measurement_status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'afd2d516257b4ebebec724602b99bd4f'
                        key: {
                            sys_ui_section: {
                                id: 'ef6064c403be43adb2f001ea5d0dcd79'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Business outcome'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'owner'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b0ce5c18f66b46a5bad9eb15017711b2'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'manual_value'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b11c1a8d5caa423abd29b043209a7708'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b1f13ee7436646ccab0b326d5a6c066f'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'allocated_count'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'b2d5c969c76a47658cd11ca2b7b1c308'
                        key: {
                            sys_ui_section: {
                                id: 'a75ecfbb27f54f0fb4dde7a7183e1815'
                                key: {
                                    name: 'x_enno_pivot_assessment'
                                    caption: 'Run summary'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'slow_count'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b36e3ac114c543fcbfd8e021890ded99'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'product_family'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b3c81d5fdfaa4054853e123378806faf'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'manual_value_date'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b498818b11a041c2824e49439b03e93d'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'number'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b4abb95ae6f645b091d08e9ef467cf15'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'sys_domain'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'b4b172326f3a4806827737e9ad9bb15d'
                        key: {
                            list_id: {
                                id: 'c8f1ea41dbff4a3ea2a307984c962c5e'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'utilization'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b4fd524657144288b58c8e936a826c67'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'seed_applied'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'b522dcfbbd664f9cbcfdcddf56d452a6'
                        key: {
                            sys_ui_section: {
                                id: '5a8c6a83e3c145c5916a2044d0c6fa69'
                                key: {
                                    name: 'x_enno_pivot_assessment'
                                    caption: 'Assessment'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'run_date'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b557b2bfd48b464f9cae34fa67c6ef89'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'objective'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'b56485162b3d44eba8e9cf0f332c8c5d'
                        key: {
                            sys_ui_section: {
                                id: '8c68cb6bbb904e73b0c8786676a8b79d'
                                key: {
                                    name: 'x_enno_pivot_roadmap_item'
                                    caption: 'Roadmap item'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_ui_list'
                        id: 'b5e117f4ae4d462ba27b610b2d92b5a0'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                            element: 'NULL'
                            relationship: 'NULL'
                            parent: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'b5e9578a7bb84a5ea5704ea85d21878b'
                        key: {
                            list_id: {
                                id: 'b5e117f4ae4d462ba27b610b2d92b5a0'
                                key: {
                                    name: 'x_enno_pivot_assessment'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'run_date'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'b5fe2d9c9c9c431ca7402f1d4fc419d3'
                        key: {
                            sys_security_acl: '5e290efe18834bab892703b2903c6463'
                            sys_user_role: {
                                id: '6956f4c54234436d86b317b5d18a6db7'
                                key: {
                                    name: 'x_enno_pivot.viewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b613f9f1178a4c37af2e84dec2aa1853'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'installed'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'b6314ed911b34dbb95bc8b0f734cacf4'
                        key: {
                            sys_ui_section: {
                                id: 'd6297d80f1f645a3bd446ee6e34b2712'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'baseline_date'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b778cf37310946248b5f6d615b9c8dbe'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'low_volume_expected'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b78cf0d2f33d40599cdb5b1bac7eb83c'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'expected_benefit'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b7e6e799d51b49a580f6f12384ee629d'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'run_date'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b7e7e717750e414e941ccc7d0d6aa75b'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'utilization'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'b7ecd6f46f8e4e3ea68547906b86841c'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '032b4c510fd74b01b1a59a2af5c1a556'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'b825a156d40e4347915cae7112e7e92e'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'status'
                            value: 'complete'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b8a4c08740b445f88f5e2e89365272eb'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'filter_used'
                        }
                    },
                    {
                        table: 'sys_ui_policy_action'
                        id: 'b8fdcbc1159d452d9372cc660dac9768'
                        key: {
                            ui_policy: {
                                id: 'a58b49ef735f4d71a304e5ab270490bb'
                                key: {
                                    table: 'x_enno_pivot_business_outcome'
                                    short_description: 'PIVOT – Manual KPI: value and date are required, calculation fields hidden'
                                }
                            }
                            field: 'manual_value'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'b92ff3ab34894c13a4dd6f10359b8681'
                        key: {
                            sys_security_acl: '60a69210d9f448f0823f50c4596b1193'
                            sys_user_role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'b95e332a33bc4aac9ea22803f3eb579c'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'trigger'
                            value: 'weekly'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'ba082c79d02041458fe6ccb053bbd189'
                        key: {
                            sys_ui_section: {
                                id: '9893ab8b4c0f4065a1dc669ab2610139'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'KPI filter and baseline change'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'kpi_filter'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'ba5a917bc5724524842999f35e4acf5a'
                        key: {
                            sys_ui_section: {
                                id: '6c681e552bae4f43a898db7fce627e42'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'over_allocated'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ba938971977047f88284bb96bc8f12e6'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'baseline'
                        }
                    },
                    {
                        table: 'sys_number'
                        id: 'bbb4526efde7406dac53056b0238280d'
                        key: {
                            category: 'x_enno_pivot_capability'
                            prefix: 'PVC'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'bbcf5b6683914ec6958539955d209734'
                        key: {
                            list_id: {
                                id: 'e48c60cc2751480bb903419efcbbedf5'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'target'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'bc4de6f4cbb746ec9c24506a178b2088'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '6fb51fcd30af420ab2e53fffefe82133'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'linked_app'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bc4fdee917ad4f848e963a8e48a47372'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'baseline_date'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bc747ea63ae940fda65165766093011e'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'date_field'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bc89c7ce3c9741058495b6623d5d1025'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'active'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bca612a9dc5b4cb5bccae26578cdf2e3'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'current_value'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'bce811a8cb074b25ab7528b4dee44d94'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'bd9b794848884ad5a7f3478246a89b0d'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '032b4c510fd74b01b1a59a2af5c1a556'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'target_value'
                            position: '9'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'bd9eb5d142a241cbbb75ee21dd925453'
                        key: {
                            application_file: '62fdc349d5a0403c8c4f54351b01274a'
                            source_artifact: '4b95afbf928f46e5b1b90f66da64c95d'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bde657e1013a4722a20b79e84f0d481a'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'sys_domain'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'be9e8bc5076f4018a77bf1458796d06f'
                        key: {
                            sys_security_acl: 'ed7d876b35f74cbba813c3d522fe7ec0'
                            sys_user_role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_policy'
                        id: 'becea799583a4850b6228de6f0bc7063'
                        key: {
                            table: 'x_enno_pivot_business_outcome'
                            short_description: 'PIVOT – Calculated KPI: table required, manual value hidden'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'bf06a4e7954c4c51b6bc992ec87e4c5f'
                        key: {
                            list_id: {
                                id: 'b5e117f4ae4d462ba27b610b2d92b5a0'
                                key: {
                                    name: 'x_enno_pivot_assessment'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'overall_score'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bf16711ee2c04db5a1d1a5002587f0fe'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'kpi_filter'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'bf89fa30db5c4ad1971f71b8cad96e5b'
                        key: {
                            document_key: '70f532acab9e4593b78a4f29619d5326'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c01167a5b4244326a7f6f7a8b220305e'
                        key: {
                            name: 'x_enno_pivot_outcome_result'
                            element: 'reason'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c0b16974bbc3492f9530406878b8430d'
                        key: {
                            name: 'x_enno_pivot_roadmap_item'
                            element: 'assessment'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'c0d425004f9647eead027e7db6d9b282'
                        key: {
                            sys_ui_section: {
                                id: '5dd1ffafdb9340e08d66b47cc4ffb58f'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Manual value'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c0db6f75d9654aca9d3a174c91f1715f'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c12572952a29443da575de70b49855dd'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'number'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_policy_action'
                        id: 'c2c50f18601e4df2acda2f1774dc77c5'
                        key: {
                            ui_policy: {
                                id: 'a58b49ef735f4d71a304e5ab270490bb'
                                key: {
                                    table: 'x_enno_pivot_business_outcome'
                                    short_description: 'PIVOT – Manual KPI: value and date are required, calculation fields hidden'
                                }
                            }
                            field: 'kpi_aggregate'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'c2ff700be3a74e9da4f608ab3acdb70f'
                        key: {
                            sys_ui_section: {
                                id: '5a8c6a83e3c145c5916a2044d0c6fa69'
                                key: {
                                    name: 'x_enno_pivot_assessment'
                                    caption: 'Assessment'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'sys_domain'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'c360beb2173e4dc09d286057a920e604'
                        key: {
                            sys_ui_section: {
                                id: '8c68cb6bbb904e73b0c8786676a8b79d'
                                key: {
                                    name: 'x_enno_pivot_roadmap_item'
                                    caption: 'Roadmap item'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'sequence'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c36d42333ad647a98965dba6498ce795'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'c3eb4472fea44daf823f4527f0f18010'
                        key: {
                            name: 'x_enno_pivot_outcome_result'
                            element: 'outcome_status'
                            value: 'on_target'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: 'c469db8764964b89ab1a7cefb38ba83f'
                        key: {
                            name: 'x_enno_pivot.admin'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'c47fea106fe143b9a24ca9b477138c09'
                        key: {
                            sys_security_acl: '05688a7c39e940cca3f201d0cd030918'
                            sys_user_role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'c4aed787ca7a49bd8364e21fe04bb7ef'
                        key: {
                            sys_ui_section: {
                                id: 'ef6064c403be43adb2f001ea5d0dcd79'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Business outcome'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'important_objective'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'c4f52c992ef24bc2a3cdb144a8887d82'
                        key: {
                            sys_ui_section: {
                                id: '904abf0012e344ebb2fd4f645b7a7b4a'
                                key: {
                                    name: 'x_enno_pivot_opportunity'
                                    caption: 'Opportunity'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'number'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c50ff6b7870e43fe97e30467ccb3b25f'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c575499476f64f4b9c01112d0fd0c605'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'important_objective'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'c588eeec5d2e4f0b8cbd719bbe3f0e87'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'measurement_status'
                            value: 'not_measured'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c59e4fd063d84594877c05015c65cf3d'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'last_discovered'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c5fefda8a5464542bb12db6e22744ca0'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'target_value'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'c60f53d0d5bf45189f683ba9103cf635'
                        key: {
                            sys_ui_section: {
                                id: 'f990e296cccb426c8142d7a74a3d0971'
                                key: {
                                    name: 'x_enno_pivot_outcome_result'
                                    caption: 'Outcome result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'outcome'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'c6ad7d1737ee44afbb59c1afccc83408'
                        key: {
                            list_id: {
                                id: 'e48c60cc2751480bb903419efcbbedf5'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'owner'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'c6bcac8ee6ce4abe83ec9d6e46f7ca9c'
                        key: {
                            sys_ui_section: {
                                id: '6c681e552bae4f43a898db7fce627e42'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c7301b1ba4094fdaa1d39e6553c3304f'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'baseline_date'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'c7343f9e83744dd6aa432b71a038a99e'
                        key: {
                            sys_ui_section: {
                                id: 'a75ecfbb27f54f0fb4dde7a7183e1815'
                                key: {
                                    name: 'x_enno_pivot_assessment'
                                    caption: 'Run summary'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'inactive_count'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'c7dee60ad10b411fac7cbe208b3b475a'
                        key: {
                            sys_ui_section: {
                                id: '5bd62381046c4b169f9aff0f63d685d5'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Discovery'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_number'
                        id: 'c82b0383b3644132bdbfa8c3fcf3f65e'
                        key: {
                            category: 'x_enno_pivot_opportunity'
                            prefix: 'PVO'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'c8a1e38f1c6540ab85962b820da17576'
                        key: {
                            sys_security_acl: '1a5b0fc90671489fac5352751156e921'
                            sys_user_role: {
                                id: 'e034e3e1405040a28970a9b4310b9f2c'
                                key: {
                                    name: 'x_enno_pivot.analyst'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_list'
                        id: 'c8f1ea41dbff4a3ea2a307984c962c5e'
                        key: {
                            name: 'x_enno_pivot_result'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                            element: 'NULL'
                            relationship: 'NULL'
                            parent: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_policy'
                        id: 'c914ee7faff349f5980ce264585ac6c8'
                        key: {
                            table: 'x_enno_pivot_business_outcome'
                            short_description: 'PIVOT – Sum or average: the field to aggregate is required; hidden for count'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'c93f17980e644cb18c856506311067a6'
                        key: {
                            application_file: 'dc56b9fccbff469dbc1a4c38d8d01c8d'
                            source_artifact: '4b95afbf928f46e5b1b90f66da64c95d'
                        }
                    },
                    {
                        table: 'm2m_sp_dependency_js_include'
                        id: 'c98ecb310c2142c383013636ecaa8c39'
                        deleted: true
                        key: {
                            sp_js_include: '84560a97bd294bf4ac9f669705444cf1'
                            sp_dependency: 'daa1773daabd4aa4a8b946497aa4e1ae'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'c9a0bbff6b34426198a0f4e75c2bcbe7'
                        key: {
                            sys_ui_section: {
                                id: 'cb50c08c10e74c0490783a8aa93c32e8'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Objective'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'objective'
                            position: '0'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'ca5cd01aa4bb4ddfbf54592f9456f49f'
                        key: {
                            name: 'x_enno_pivot_result'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ca71f0de3dab40698affac27d72d0dbd'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'weight'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'cad5bf9bbcbb41e5acb5be997da8eb43'
                        key: {
                            list_id: {
                                id: '0d8334e93d19412983871dd305e346de'
                                key: {
                                    name: 'x_enno_pivot_roadmap_item'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'phase'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: 'cb50c08c10e74c0490783a8aa93c32e8'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            caption: 'Objective'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'cb879c9bb5c146fe90f68fef2588f5a5'
                        key: {
                            sys_security_acl: 'cbba72d582a846469f62e9015b2d187f'
                            sys_user_role: {
                                id: '6956f4c54234436d86b317b5d18a6db7'
                                key: {
                                    name: 'x_enno_pivot.viewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'cb9ce82826db46c4ae61c85be7b08458'
                        key: {
                            sys_ui_section: {
                                id: '52696a400a80455a97a6fc1d07c828c9'
                                key: {
                                    name: 'x_enno_pivot_opportunity'
                                    caption: 'Priority'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'effort'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'cc78007c873b4b28a59f4ff33a5a355f'
                        key: {
                            name: 'x_enno_pivot_outcome_result'
                            element: 'outcome'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_list'
                        id: 'ccafeb6c34d4466ab3d3165272fcf75c'
                        key: {
                            name: 'x_enno_pivot_capability'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                            element: 'NULL'
                            relationship: 'NULL'
                            parent: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'ccce1f1dc86f46a8a00536160590c6aa'
                        key: {
                            list_id: {
                                id: 'c8f1ea41dbff4a3ea2a307984c962c5e'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'target_value'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'cdcd196c463a4c6f8c90bdd7133492e3'
                        key: {
                            sys_ui_section: {
                                id: '6c681e552bae4f43a898db7fce627e42'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'allocated_count'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: 'ce47c71ed40e443e8f4f1422b62d6252'
                        key: {
                            sys_ui_form: {
                                id: '880c5aefbd944d0e859436b9c23e8676'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '032b4c510fd74b01b1a59a2af5c1a556'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'cecfe9c327be489ba1277fb27e261796'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'cef04bce37b64449a1b1919a33edbbd2'
                        key: {
                            sys_ui_section: {
                                id: '032b4c510fd74b01b1a59a2af5c1a556'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'reason'
                            position: '12'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'cf09c2ae2d1a4d1281195febf01ba8f3'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '032b4c510fd74b01b1a59a2af5c1a556'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'sys_domain'
                            position: '10'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'cf88bd0991924269b75cd80f1974a3e1'
                        key: {
                            sys_ui_section: {
                                id: 'ef6064c403be43adb2f001ea5d0dcd79'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Business outcome'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'direction'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd011543130fe4e05a06715caf692402a'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'licensed'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd02715dfff2e49539feeb3b64073572f'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'period'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'd15538e347a14eff995200541c104c16'
                        key: {
                            sys_ui_section: {
                                id: '032b4c510fd74b01b1a59a2af5c1a556'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'target_value'
                            position: '11'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'd191eb553a0f4c4fbb2e48b159a9d83b'
                        key: {
                            sys_ui_section: {
                                id: '52696a400a80455a97a6fc1d07c828c9'
                                key: {
                                    name: 'x_enno_pivot_opportunity'
                                    caption: 'Priority'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd19ddd5a063340c8bc7b8ec6f60e8795'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'kpi_aggregate'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'd1c907b21d4a4eab9b19e1a65d53ac68'
                        key: {
                            list_id: {
                                id: 'e48c60cc2751480bb903419efcbbedf5'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'baseline'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd1e617a92249467c945c873aeaae0609'
                        key: {
                            name: 'x_enno_pivot_roadmap_item'
                            element: 'phase'
                            value: 'next'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'd21bfd04a237419981e33cb49e635ccf'
                        key: {
                            sys_ui_section: {
                                id: '760c4e015ceb45999b4ea4b5f246effb'
                                key: {
                                    name: 'x_enno_pivot_opportunity'
                                    caption: 'Decision'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'rejection_reason'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd2c47f2d483b462baa75234268ac50d8'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'not_measured_count'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'd2d118765bfc4dacbac6f1a69f00cee1'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '032b4c510fd74b01b1a59a2af5c1a556'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'actual_value'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'd49eced1250a4e2fa7b7a065d9216ab7'
                        key: {
                            document_key: 'c78765c4e89f44dea6a1e3adb5917c48'
                            variable: '6f69fc4aff6433008d3f5d9ad53bf18c'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'd5baf760c16149538d6079dce550fa07'
                        key: {
                            sys_ui_section: {
                                id: '5a8c6a83e3c145c5916a2044d0c6fa69'
                                key: {
                                    name: 'x_enno_pivot_assessment'
                                    caption: 'Assessment'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'number'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'd5cebcb0084f4d338c69be8ae2962d24'
                        key: {
                            sys_ui_section: {
                                id: '46678275426f4072bffcf0b67c787263'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Capability'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'app_scope'
                            position: '11'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'd60d2b9af5ea46e687bcdfd97b3b4911'
                        key: {
                            list_id: {
                                id: 'ccafeb6c34d4466ab3d3165272fcf75c'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'product_family'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: 'd6297d80f1f645a3bd446ee6e34b2712'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            caption: 'Measurement'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd68e55848140444bb3403bafa069fe7d'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'entitled_count'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'd6d3b620cb7349999116b084587cfe11'
                        key: {
                            sys_security_acl: '629bb89e79314948adb13a306010213a'
                            sys_user_role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd6f14fda2d8f438284e70cff591a2afa'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'score'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd7b3470ded8f45e6b945bdcc286690ea'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'number'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'd8905943207341f8978ee62b3a1093d6'
                        key: {
                            sys_ui_section: {
                                id: '032b4c510fd74b01b1a59a2af5c1a556'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'capability'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: 'd8c4cc50fe254b92a24d7f4977bf48b5'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd9274e99e6ad4f93b77159ac6a3657a0'
                        key: {
                            name: 'x_enno_pivot_outcome_result'
                            element: 'outcome_status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'da380e9511e6481283e5235d7c8c242e'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'priority'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'da8094dd0ff84d9388d606cbdff08e37'
                        key: {
                            sys_ui_section: {
                                id: '52696a400a80455a97a6fc1d07c828c9'
                                key: {
                                    name: 'x_enno_pivot_opportunity'
                                    caption: 'Priority'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'priority_reason'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'db259dfcf8904c0c847504833e379e86'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '032b4c510fd74b01b1a59a2af5c1a556'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'utilization'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'db3e21ac65f3494991c6698dd42002f3'
                        key: {
                            sys_ui_section: {
                                id: 'f990e296cccb426c8142d7a74a3d0971'
                                key: {
                                    name: 'x_enno_pivot_outcome_result'
                                    caption: 'Outcome result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'improvement_pct'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_ui_page'
                        id: 'dc56b9fccbff469dbc1a4c38d8d01c8d'
                        key: {
                            endpoint: 'x_enno_pivot_workspace.do'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'dc6a7f3c088a43bbab56b4053b75f39e'
                        key: {
                            sys_ui_section: {
                                id: '46678275426f4072bffcf0b67c787263'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Capability'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'number'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'de2476c6d84d49e6959456345b1a7bf9'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'source'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'deff7eb99b794d51ad66602f3ebb3a39'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'allocated_count'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'df54e61249794bddb75e737991f474d4'
                        key: {
                            name: 'x_enno_pivot_outcome_result'
                            element: 'outcome_status'
                            value: 'improved'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'df7453063cb24d7ea185e813559ce831'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'sys_domain'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'df7be644f7d848dabafe7803e4d8afb3'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'days_back'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'dfcd5de43b41403e941476a22dea9fa1'
                        key: {
                            document_key: 'b1369cb979dc46b38cd9beca4b6f2899'
                            variable: '42f2564b73031300440211d8faf6a777'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'dfdc8ad2daed40e89cc45806b9020b54'
                        key: {
                            name: 'x_enno_pivot_outcome_result'
                            element: 'outcome'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'dff923968efb4d9cb08214598bbe5915'
                        key: {
                            sys_security_acl: 'b3ac89fbee13428cbc6f5a7994649bc7'
                            sys_user_role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: 'e034e3e1405040a28970a9b4310b9f2c'
                        key: {
                            name: 'x_enno_pivot.analyst'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'e1c40072ca3647648a804bf43cbc3354'
                        key: {
                            list_id: {
                                id: 'ccafeb6c34d4466ab3d3165272fcf75c'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'licensed'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e20b2a9e51774b9b9fe9cbabb0447222'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'measurement_status'
                            value: 'not_installed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'e225dc12857349f7909d1dcb628cf774'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '032b4c510fd74b01b1a59a2af5c1a556'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '11'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'e293c1fb982e4c8498e937ac4c0f26d0'
                        key: {
                            sys_ui_section: {
                                id: '52696a400a80455a97a6fc1d07c828c9'
                                key: {
                                    name: 'x_enno_pivot_opportunity'
                                    caption: 'Priority'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e2ea6884ab364678bfa87b15e26eb0e6'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'baseline_change_reason'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e356d452543e4359b798d3f6411a47fe'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'source'
                            value: 'subscription'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e3a938ab86504b218f1741c7c9e1a488'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'product_family'
                            value: 'platform'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'e42d13098c074fe48335964bfb90753c'
                        key: {
                            list_id: {
                                id: 'c8f1ea41dbff4a3ea2a307984c962c5e'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'score'
                        }
                    },
                    {
                        table: 'sys_user_role_contains'
                        id: 'e43ff706df164efc9ce33e8214ea279e'
                        key: {
                            role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                            contains: {
                                id: 'e034e3e1405040a28970a9b4310b9f2c'
                                key: {
                                    name: 'x_enno_pivot.analyst'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_list'
                        id: 'e48c60cc2751480bb903419efcbbedf5'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                            element: 'NULL'
                            relationship: 'NULL'
                            parent: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e4dad63c0cb043c392b642f342b6a699'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'target_value'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e4eff1655de142b08fa4e975d7f2727c'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'sys_domain'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'e52a913efca6413687e80426d3397f61'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '5bd62381046c4b169f9aff0f63d685d5'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Discovery'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: 'e5756b502ccf46ec9968a701ebaa7260'
                        key: {
                            sys_ui_form: {
                                id: '880c5aefbd944d0e859436b9c23e8676'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '6c681e552bae4f43a898db7fce627e42'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e591a5c2a2d146a681424d48e5a50d3d'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'low_volume_expected'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e6725c4440ae43df8944a8b008598e1c'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'value'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'e7bb73821d854ec081dad56a01d9f250'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'product_family'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: 'e8699e59aced45c997169ca82f8d5fd6'
                        key: {
                            sys_ui_form: {
                                id: '932fd5545ee34303a4e104b524e39ba2'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '3c39cb2a0f804c6ca902dd1bbfbabc59'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Measurement filter'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e91983b77dda465dadb2e6e2bbd50fd2'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'kpi_aggregate'
                            value: 'count'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'e93f1d635d4643369fadc17135f723a7'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'type'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'e969b2932a0e4dbca751efc1ecad9479'
                        key: {
                            name: 'x_enno_pivot_capability'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e9c2ef4c98d541e3a1c902d6bab390a6'
                        key: {
                            name: 'x_enno_pivot_roadmap_item'
                            element: 'phase'
                            value: 'now'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'ea04e026620d463bbe7de0a24da934f9'
                        key: {
                            id: '7514885695154efe9994185045e461f1'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            field: 'script'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'ea1e68b89717451fa29111867ce3b06d'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '6c681e552bae4f43a898db7fce627e42'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '10'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ea61a53f7fee4a14a2f282a17d78de86'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'sys_domain'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ea730651322b4d188b93aa9b1ce8a954'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'inactive_count'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'eae78f815b7347f896a681e55420fcd2'
                        key: {
                            name: 'x_enno_pivot_roadmap_item'
                            element: 'opportunity'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'ec1182e18f6e4ce49911410b7547cf71'
                        key: {
                            sys_security_acl: '17d96932a7404fe2a9596a136892ceb4'
                            sys_user_role: {
                                id: 'c469db8764964b89ab1a7cefb38ba83f'
                                key: {
                                    name: 'x_enno_pivot.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'ec176e4a9d6240d693a8e2078bde7823'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'period'
                            value: 'yearly'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ec585851b64049868c8357846be91d87'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'target_value'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'ec5de6eaa43e4218bc23bea98f957901'
                        key: {
                            list_id: {
                                id: 'e48c60cc2751480bb903419efcbbedf5'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'objective'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'ec7c659c4c7947879f1d484847098077'
                        key: {
                            sys_ui_section: {
                                id: 'ef6064c403be43adb2f001ea5d0dcd79'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Business outcome'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'kpi'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_user_role_contains'
                        id: 'eca401c03a354060aa2a64cfde7b61d4'
                        key: {
                            role: {
                                id: 'e034e3e1405040a28970a9b4310b9f2c'
                                key: {
                                    name: 'x_enno_pivot.analyst'
                                }
                            }
                            contains: {
                                id: '6956f4c54234436d86b317b5d18a6db7'
                                key: {
                                    name: 'x_enno_pivot.viewer'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: 'ef6064c403be43adb2f001ea5d0dcd79'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            caption: 'Business outcome'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ef7a9c59e6fb471b9e09875688230404'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'log'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'ef7b8a4153584bf9824880e046c101d7'
                        key: {
                            sys_ui_section: {
                                id: 'f990e296cccb426c8142d7a74a3d0971'
                                key: {
                                    name: 'x_enno_pivot_outcome_result'
                                    caption: 'Outcome result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'outcome_status'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'efa568903aed4fdcb5b61b38c331ef57'
                        key: {
                            sys_ui_section: {
                                id: '8c68cb6bbb904e73b0c8786676a8b79d'
                                key: {
                                    name: 'x_enno_pivot_roadmap_item'
                                    caption: 'Roadmap item'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'sys_domain'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'eff0020771764f83a50d587ccfd95abc'
                        key: {
                            list_id: {
                                id: '295e2d3db62a46a0ba104345faa2bfa9'
                                key: {
                                    name: 'x_enno_pivot_outcome_result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'target'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f0951d5bde654938892df1640fa33068'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'measure_table'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'f0af60dcf342464f84f11be8c07ec511'
                        key: {
                            sys_security_acl: 'cef961ac9d944f02a24d9a9d1dd507a7'
                            sys_user_role: {
                                id: 'e034e3e1405040a28970a9b4310b9f2c'
                                key: {
                                    name: 'x_enno_pivot.analyst'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'f1965478a1584fb7bba81ee99b5c79d8'
                        key: {
                            id: 'c5a209b603754636b967bf54573ddc56'
                            table: 'var__m_atf_input_variable_41de4a935332120028bc29cac2dc349a'
                            field: 'script'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f1f8f013b02c43188d4fc1d76d03a017'
                        key: {
                            name: 'x_enno_pivot_assessment'
                            element: 'overall_score'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f29561b5df4b45d580a787315d9b959f'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '032b4c510fd74b01b1a59a2af5c1a556'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'actual_value'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'f30b7ef4503e45a78b09a2697be35167'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'state'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f36db41df5324c2aad6a831b72a843f7'
                        key: {
                            sys_ui_section: {
                                id: '6fb51fcd30af420ab2e53fffefe82133'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f3974a58d27a4b5da40c5e0cc9cded5c'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'priority_reason'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f3bfba408382427cbec9e162f9ee8e78'
                        key: {
                            sys_ui_section: {
                                id: '6fb51fcd30af420ab2e53fffefe82133'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'target_value'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f3c5f0690bd24ce0856df2181b411bcd'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'measure_table'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f3f3b181df2e4a1fbe1347ca659b77e2'
                        key: {
                            sys_ui_section: {
                                id: '8c68cb6bbb904e73b0c8786676a8b79d'
                                key: {
                                    name: 'x_enno_pivot_roadmap_item'
                                    caption: 'Roadmap item'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'f4e3850aaf044cdfb6dd200432711bf8'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'status'
                            value: 'below_target'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'f4e6de59fe784494973a00b8f871b424'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'source'
                            value: 'plugin'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f549cabeb36d4e3bbdf1b928e89fbb72'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'kpi_table'
                        }
                    },
                    {
                        table: 'sys_ui_policy_action'
                        id: 'f5fa1043dbdb47cf9db4a51fc7840d4c'
                        key: {
                            ui_policy: {
                                id: 'a58b49ef735f4d71a304e5ab270490bb'
                                key: {
                                    table: 'x_enno_pivot_business_outcome'
                                    short_description: 'PIVOT – Manual KPI: value and date are required, calculation fields hidden'
                                }
                            }
                            field: 'kpi_field'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f61afd998b424278bb1eb578eaf04dd9'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f66d1d4acf134cf2825136763fe39f55'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'direction'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f67cc95bd54348fdbc30ed5db91ebe25'
                        key: {
                            sys_ui_section: {
                                id: '46678275426f4072bffcf0b67c787263'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Capability'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'installed'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f6a070ea8eea4aa4b317efc821354060'
                        key: {
                            sys_ui_section: {
                                id: '5bd62381046c4b169f9aff0f63d685d5'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Discovery'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'not_found'
                            position: '6'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'f6ddb577ff164b30846719a176d21a93'
                        key: {
                            application_file: '803bbf23660f4ded8af1797084f82b4d'
                            source_artifact: '4b95afbf928f46e5b1b90f66da64c95d'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f79248faa4684915bc8c1c05d54d6832'
                        key: {
                            sys_ui_section: {
                                id: 'd6297d80f1f645a3bd446ee6e34b2712'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'kpi_field'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f7c47f54c5444d01934f4eb5b685c603'
                        key: {
                            sys_ui_section: {
                                id: '5a8c6a83e3c145c5916a2044d0c6fa69'
                                key: {
                                    name: 'x_enno_pivot_assessment'
                                    caption: 'Assessment'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'run_by'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f82cce268f0d40e9bae46021a8c83ef2'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'installed'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f83067194276423593994c78056ce8c3'
                        key: {
                            sys_ui_section: {
                                id: 'd6297d80f1f645a3bd446ee6e34b2712'
                                key: {
                                    name: 'x_enno_pivot_business_outcome'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'current_value'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f86444a7226c4e49843f3c478ba4a830'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'rejection_reason'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f88c076ab63447749c879d85ca27ae21'
                        key: {
                            sys_ui_section: {
                                id: '6c681e552bae4f43a898db7fce627e42'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'entitled_count'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f8a59b064fbc4eb093487de7783de54f'
                        key: {
                            sys_ui_section: {
                                id: '032b4c510fd74b01b1a59a2af5c1a556'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'score'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f8c6fa2b0da24c4092ce7e26708899ce'
                        key: {
                            sys_ui_section: {
                                id: '6c681e552bae4f43a898db7fce627e42'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Measurement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'measure_table'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f98a03a273c849fe9c82526537d365ce'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'capability'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: 'f990e296cccb426c8142d7a74a3d0971'
                        key: {
                            name: 'x_enno_pivot_outcome_result'
                            caption: 'Outcome result'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'fa12cdfffae14e29ba09c84a317cec57'
                        key: {
                            sys_ui_section: {
                                id: '46678275426f4072bffcf0b67c787263'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Capability'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'licensed'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fa13669838764415b884598875601da3'
                        key: {
                            name: 'x_enno_pivot_business_outcome'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'fa1b1ee4ca4140278d919bc98176b170'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'not_found'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'fa66de481a8541199f06235275c8309a'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'app_scope'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'fa9ca5263a784327a988cebded673dbf'
                        key: {
                            list_id: {
                                id: '295e2d3db62a46a0ba104345faa2bfa9'
                                key: {
                                    name: 'x_enno_pivot_outcome_result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'outcome_status'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'fbefa02d910c44d9a1bf827ea4bdff9d'
                        key: {
                            sys_ui_section: {
                                id: 'a75ecfbb27f54f0fb4dde7a7183e1815'
                                key: {
                                    name: 'x_enno_pivot_assessment'
                                    caption: 'Run summary'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'scored_count'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'fc33bf5fe5d64a909acb4eebef05a91d'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'product_family'
                            value: 'itam'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'fc8ec8a821074234b5c36473bdb57526'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fcbd39b99f1547a9a6ce924313d83d4a'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'description'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'fd8ecc91c71442ba871506d2682391dd'
                        key: {
                            name: 'x_enno_pivot_result'
                            element: 'measurement_status'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'fdfd4e0fd4e54bcbb4f228d71608207b'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '032b4c510fd74b01b1a59a2af5c1a556'
                                key: {
                                    name: 'x_enno_pivot_result'
                                    caption: 'Result'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'measurement_status'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'fe5b90c82e0848d39d268eb1620ac8f9'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'last_discovered'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'fe6caa5948a842a291f0ee6bf09079c5'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'capability'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'feb5e2aa35e44069801cdda1ca046fab'
                        key: {
                            sys_ui_section: {
                                id: '904abf0012e344ebb2fd4f645b7a7b4a'
                                key: {
                                    name: 'x_enno_pivot_opportunity'
                                    caption: 'Opportunity'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'assigned_to'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fec5b429b9fd479f8296cb56cefc8aa4'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'app_scope'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fec798ce6e4b47fe98b5ee10684e2c16'
                        key: {
                            name: 'x_enno_pivot_outcome_result'
                            element: 'assessment'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ff0f2acc7b4443db9dc11be14f197fa5'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'ff4ecafc1f474bffa3eeb278e35e1a0f'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '5bd62381046c4b169f9aff0f63d685d5'
                                key: {
                                    name: 'x_enno_pivot_capability'
                                    caption: 'Discovery'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'not_found'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'ff63993652ec4abbbe89ca439ec5d57c'
                        key: {
                            name: 'x_enno_pivot_capability'
                            element: 'product_family'
                            value: 'other'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'ffb42b41bc7146689fb32a9ae5dec48c'
                        key: {
                            name: 'x_enno_pivot_opportunity'
                            element: 'type'
                            value: 'shelfware'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                ]
            }
        }
    }
}
