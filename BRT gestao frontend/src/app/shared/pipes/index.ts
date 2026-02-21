import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyVnd', standalone: true })
export class CurrencyVndPipe implements PipeTransform {
    transform(value: number | null | undefined): string {
        if (value == null) return '—';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);
    }
}

@Pipe({ name: 'dateVi', standalone: true })
export class DateViPipe implements PipeTransform {
    transform(value: Date | string | null | undefined, format: 'short' | 'full' | 'time' | 'date' = 'short'): string {
        if (!value) return '—';
        const d = new Date(value);
        if (isNaN(d.getTime())) return '—';
        const pad = (n: number) => n.toString().padStart(2, '0');
        switch (format) {
            case 'time': return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
            case 'date': return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
            case 'full': return `${pad(d.getHours())}:${pad(d.getMinutes())} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
            default: return `${pad(d.getHours())}:${pad(d.getMinutes())} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
        }
    }
}

@Pipe({ name: 'statusLabel', standalone: true })
export class StatusLabelPipe implements PipeTransform {
    private labels: Record<string, string> = {
        ACTIVE: 'Hoạt động', INACTIVE: 'Ngừng', DRAFT: 'Nháp', SUSPENDED: 'Tạm treo',
        AVAILABLE: 'Sẵn sàng', ON_DUTY: 'Đang làm', OFF_DUTY: 'Hết ca', ON_LEAVE: 'Nghỉ phép',
        IDLE: 'Chờ', MAINTENANCE_REQUIRED: 'Cần bảo trì', UNDER_REPAIR: 'Đang sửa', DECOMMISSIONED: 'Loại bỏ', REGISTERED: 'Đã ĐK',
        OPEN: 'Mở', ASSIGNED: 'Đã giao', IN_PROGRESS: 'Đang XL', RESOLVED: 'Đã GQ', CLOSED: 'Đóng',
        SCHEDULED: 'Lên lịch', COMPLETED: 'Hoàn thành', CANCELLED: 'Hủy', DELAYED: 'Trễ',
        PENDING: 'Chờ duyệt', APPROVED: 'Duyệt', REJECTED: 'Từ chối', REFUNDED: 'Đã hoàn',
        RUNNING: 'Đang chạy', STOPPED: 'Dừng', ERROR: 'Lỗi', DISABLED: 'Tắt',
        NEW: 'Mới', REVIEWED: 'Đã xem', RESPONDED: 'Đã PH',
        EXPIRED: 'Hết hạn', DISPATCHED: 'Đã điều',
        WAITING_PARTS: 'Chờ phụ tùng', INSPECTING: 'Đang KT',
    };
    transform(value: string | null | undefined): string {
        if (!value) return '—';
        return this.labels[value] || value;
    }
}

@Pipe({ name: 'truncate', standalone: true })
export class TruncatePipe implements PipeTransform {
    transform(value: string | null | undefined, length = 50): string {
        if (!value) return '';
        return value.length > length ? value.substring(0, length) + '...' : value;
    }
}
