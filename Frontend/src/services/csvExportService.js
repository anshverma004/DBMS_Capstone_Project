export function exportAuditLogsToCsv(auditLogs = []) {
    if (!auditLogs.length) return;
    const headers = [
        'Log_ID',
        'Show_ID',
        'Seat_Code',
        'Old_Status',
        'New_Status',
        'Old_Version',
        'New_Version',
        'Acted_By_User',
        'Changed_At_Timestamp'
    ];
    const rows = auditLogs.map((l) => [
        l.log_id,
        l.show_id,
        l.seat_code,
        l.old_status,
        l.new_status,
        `v${l.old_version}`,
        `v${l.new_version}`,
        `"${(l.user_name || '-').replace(/"/g, '""')}"`,
        `"${new Date(l.changed_at).toISOString()}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `mysql_seat_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
