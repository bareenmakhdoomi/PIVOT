import '@servicenow/sdk/global'
import { EmailNotification, Record } from '@servicenow/sdk/core'

// PIV-042.02 / .03 / .04 – one mail script builds the subject and body for both run emails:
// number, status, score (or "Not available"), change since the previous completed run, opportunities raised and
// updated, warnings, completion time, the error for a failed run, and an "Open in PIVOT" link to the run dialog.
Record({
    $id: Now.ID['mail-script-run-email'],
    table: 'sys_script_email',
    data: {
        name: 'pivot_run_email',
        new_lines_to_html: false,
        script: Now.include('./pivot-run-email.js'),
    },
})

// PIV-042.01 – the notify step fires x_enno_pivot.run_complete; parm2 = the active users with x_enno_pivot.admin.
EmailNotification({
    $id: Now.ID['email-run-complete'],
    table: 'x_enno_pivot_assessment',
    name: 'PIVOT run complete',
    description: 'Sent to every active PIVOT admin when an assessment completes (also Completed with warnings).',
    active: true,
    triggerConditions: { generationType: 'event', eventName: 'x_enno_pivot.run_complete' },
    recipientDetails: { eventParm2WithRecipient: true, sendToCreator: false },
    emailContent: {
        subject: 'PIVOT run complete',
        messageHtml: '${mail_script:pivot_run_email}',
    },
})

// PIV-042.01 / .03 – a failed run fires x_enno_pivot.run_failed with the same recipients.
EmailNotification({
    $id: Now.ID['email-run-failed'],
    table: 'x_enno_pivot_assessment',
    name: 'PIVOT run failed',
    description: 'Sent to every active PIVOT admin when an assessment fails, with the failed step and error.',
    active: true,
    triggerConditions: { generationType: 'event', eventName: 'x_enno_pivot.run_failed' },
    recipientDetails: { eventParm2WithRecipient: true, sendToCreator: false },
    emailContent: {
        subject: 'PIVOT run failed',
        messageHtml: '${mail_script:pivot_run_email}',
        importance: 'high',
    },
})
