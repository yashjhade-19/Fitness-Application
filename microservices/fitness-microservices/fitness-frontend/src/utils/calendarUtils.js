/**
 * Calendar utility functions for consistency tracking
 */

// Get number of days in a month
export const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

// Get first day of month (0 = Sunday, 1 = Monday, etc.)
export const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

// Format month and year for display
export const getMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

// Group activities by date (YYYY-MM-DD)
export const groupActivitiesByDate = (activities) => {
    const grouped = {};

    activities.forEach(activity => {
        if (!activity.createdAt || !activity.caloriesBurned) return;

        // Use ISO date format for consistency
        const dateStr = new Date(activity.createdAt).toISOString().split('T')[0];

        if (!grouped[dateStr]) {
            grouped[dateStr] = 0;
        }

        grouped[dateStr] += activity.caloriesBurned;
    });

    return grouped;
};

// Determine color based on calories
export const calculateDayColor = (calories) => {
    if (calories >= 200) return 'success';
    if (calories > 0 && calories < 200) return 'warning';
    return 'grey';
};

// Get day color RGB values for styling with yellow theme
export const getDayColorValues = (calories, mode) => {
    const colors = {
        success: {
            dark: 'rgba(255, 215, 0, 0.7)',
            light: 'rgba(255, 215, 0, 0.2)',
            border: '#FFD700',
            text: '#FFD700'
        },
        warning: {
            dark: 'rgba(255, 193, 7, 0.7)',
            light: 'rgba(255, 193, 7, 0.2)',
            border: '#FFC107',
            text: '#FFC107'
        },
        grey: {
            dark: 'rgba(107, 114, 128, 0.3)',
            light: 'rgba(107, 114, 128, 0.15)',
            border: '#6B7280',
            text: '#6B7280'
        }
    };

    const colorType = calculateDayColor(calories);
    const theme = mode === 'dark' ? 'dark' : 'light';

    return {
        bg: colors[colorType][theme],
        text: mode === 'dark' ? '#FFFFFF' : '#333',
        border: colors[colorType].border
    };
};

// Calculate current and best streak - optimized to accept pre-grouped data
export const calculateStreak = (activities, groupedActivities = null) => {
    const grouped = groupedActivities || groupActivitiesByDate(activities);

    if (Object.keys(grouped).length === 0) {
        return { current: 0, best: 0 };
    }

    const activeDates = Object.keys(grouped)
        .sort()
        .map(dateStr => new Date(dateStr + 'T00:00:00Z'));

    let currentStreak = 0;
    let bestStreak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streakDate = new Date(today);

    // Work backwards from today
    for (let i = activeDates.length - 1; i >= 0; i--) {
        const activityDate = new Date(activeDates[i]);
        activityDate.setHours(0, 0, 0, 0);

        const dayDiff = Math.floor((streakDate - activityDate) / (1000 * 60 * 60 * 24));

        if (dayDiff === 0 || dayDiff === 1) {
            currentStreak++;
            bestStreak = Math.max(bestStreak, currentStreak);
            streakDate = activityDate;
        } else if (dayDiff > 1) {
            break;
        }
    }

    // Find the best streak throughout the entire data
    let tempStreak = 1;
    for (let i = 1; i < activeDates.length; i++) {
        const prevDate = new Date(activeDates[i - 1]);
        const currDate = new Date(activeDates[i]);
        prevDate.setHours(0, 0, 0, 0);
        currDate.setHours(0, 0, 0, 0);

        const dayDiff = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));

        if (dayDiff === 1) {
            tempStreak++;
            bestStreak = Math.max(bestStreak, tempStreak);
        } else {
            tempStreak = 1;
        }
    }

    return { current: currentStreak, best: bestStreak };
};

// Calculate total active days in a specific month
export const calculateActiveDays = (activities, groupedActivities, year, month) => {
    const grouped = groupedActivities;
    let count = 0;

    Object.keys(grouped).forEach(dateStr => {
        const [y, m] = dateStr.split('-');
        if (parseInt(y) === year && parseInt(m) === month + 1) {
            count++;
        }
    });

    return count;
};

// Generate calendar grid for month
export const generateCalendarGrid = (date, groupedActivities) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = getDaysInMonth(date);
    const firstDay = getFirstDayOfMonth(date);

    const grid = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayDateStr = today.toISOString().split('T')[0];

    // Padding from previous month
    for (let i = 0; i < firstDay; i++) {
        grid.push(null);
    }

    // Days of current month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateObj = new Date(year, month, day);
        const dateStr = dateObj.toISOString().split('T')[0];
        const calories = groupedActivities[dateStr] || 0;
        const isToday = dateStr === todayDateStr;

        grid.push({
            date: dateStr,
            day,
            calories,
            color: calculateDayColor(calories),
            isToday,
            isCurrentMonth: true
        });
    }

    return grid;
};
