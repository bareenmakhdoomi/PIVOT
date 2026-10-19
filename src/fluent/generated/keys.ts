import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    bom_json: {
                        table: 'sys_module'
                        id: 'f0918765f8b240bf92054b27586857dd'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '96a7857d9dc642e591d1491c9aa06c55'
                    }
                    'pivot-menu': {
                        table: 'sys_app_application'
                        id: 'b8acb94ad60b40e4b42fffad35af63d2'
                    }
                    'pivot-module-properties': {
                        table: 'sys_app_module'
                        id: '121ffc02c2e74189a612caaa80105bb1'
                    }
                    'pivot-module-workspace': {
                        table: 'sys_app_module'
                        id: '5702a5181e094ead967f169e2ea7f8de'
                    }
                    'pivot-workspace-page-read': {
                        table: 'sys_security_acl'
                        id: 'dab42fddd09945d9a3df99fac83d0e53'
                    }
                }
                composite: [
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
                        table: 'sn_glider_source_artifact'
                        id: '4b95afbf928f46e5b1b90f66da64c95d'
                        key: {
                            name: 'x_enno_pivot_workspace.do - BYOUI Files'
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
                        table: 'sys_ux_lib_asset'
                        id: '62fdc349d5a0403c8c4f54351b01274a'
                        key: {
                            name: 'x_enno_pivot/main'
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
                        table: 'sys_ux_lib_asset'
                        id: '803bbf23660f4ded8af1797084f82b4d'
                        key: {
                            name: 'x_enno_pivot/main.js.map'
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
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'bd9eb5d142a241cbbb75ee21dd925453'
                        key: {
                            application_file: '62fdc349d5a0403c8c4f54351b01274a'
                            source_artifact: '4b95afbf928f46e5b1b90f66da64c95d'
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
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'c93f17980e644cb18c856506311067a6'
                        key: {
                            application_file: 'dc56b9fccbff469dbc1a4c38d8d01c8d'
                            source_artifact: '4b95afbf928f46e5b1b90f66da64c95d'
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
                        table: 'sys_user_role'
                        id: 'e034e3e1405040a28970a9b4310b9f2c'
                        key: {
                            name: 'x_enno_pivot.analyst'
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
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'f6ddb577ff164b30846719a176d21a93'
                        key: {
                            application_file: '803bbf23660f4ded8af1797084f82b4d'
                            source_artifact: '4b95afbf928f46e5b1b90f66da64c95d'
                        }
                    },
                ]
            }
        }
    }
}
