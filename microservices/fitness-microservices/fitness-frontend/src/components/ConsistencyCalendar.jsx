import React, { useMemo, useState, memo } from 'react';
import { Box, Card, CardContent, Typography, Tooltip, IconButton } from '@mui/material';
import { useTheme } from '../context/ThemeContext';
import {
    getDaysInMonth,
    getMonthYear,
    groupActivitiesByDate,
    generateCalendarGrid,
    calculateStreak,
    calculateActiveDays,
    getDayColorValues
} from '../utils/calendarUtils';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const WEEK_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// Memoized day cell - proper calendar cell
const DayCell = memo(({ dayData, mode, isCurrentMonth }) => {
    if (!dayData) {
        return (
            <Box
                sx={{
                    minHeight: '60px',
                    border: `1px solid ${mode === 'dark' ? '#444' : '#ddd'}`,
                    backgroundColor: mode === 'dark' ? '#1a1a1a' : '#f9f9f9',
                    p: 1
                }}
            />
        );
    }

    const { day, calories, isToday } = dayData;
    const colorValues = getDayColorValues(calories, mode);

    // Determine background - lighter for non-current month days
    const isOtherMonth = !isCurrentMonth;
    const bgColor = isOtherMonth
        ? (mode === 'dark' ? '#0d0d0d' : '#fafafa')
        : colorValues.bg;

    return (
        <Tooltip
            title={`${dayData.color === 'grey' ? 'No activity' : `${calories} kcal`}`}
            arrow
            placement="top"
            disableInteractive
        >
            <Box
                sx={{
                    minHeight: '60px',
                    border: `1px solid ${mode === 'dark' ? '#444' : '#ddd'}`,
                    backgroundColor: bgColor,
                    p: 0.8,
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    overflow: 'hidden',
                    '&:hover': {
                        boxShadow: `inset 0 0 0 2px ${colorValues.border}`
                    }
                }}
            >
                {/* Day number */}
                <Typography
                    sx={{
                        fontSize: '0.9rem',
                        fontWeight: isToday ? '700' : '500',
                        color: isToday ? colorValues.border : (mode === 'dark' ? '#fff' : '#333'),
                        mb: 0.5
                    }}
                >
                    {day}
                </Typography>

                {/* Visual indicator for activity */}
                {dayData.color !== 'grey' && (
                    <Box
                        sx={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            backgroundColor: colorValues.border,
                            opacity: 0.8
                        }}
                    />
                )}
            </Box>
        </Tooltip>
    );
});

// Stat item component
const StatItem = ({ label, value, mode }) => (
    <Box sx={{ textAlign: 'center', flex: 1 }}>
        <Typography sx={{ fontSize: '0.7rem', color: mode === 'dark' ? '#9ca3af' : '#6b7280', mb: 0.25 }}>
            {label}
        </Typography>
        <Typography sx={{ color: label.includes('🔥') ? '#f97316' : '#10b981', fontWeight: 'bold', fontSize: '0.95rem' }}>
            {value}
        </Typography>
    </Box>
);

const ConsistencyCalendar = ({ activities = [], showStats = true }) => {
    const { mode } = useTheme();
    const [monthOffset, setMonthOffset] = useState(0);

    const calendarData = useMemo(() => {
        const currentMonth = new Date();
        currentMonth.setMonth(currentMonth.getMonth() + monthOffset);

        const groupedActivities = groupActivitiesByDate(activities);

        return {
            currentMonth,
            daysInMonth: getDaysInMonth(currentMonth),
            monthYear: getMonthYear(currentMonth),
            grid: generateCalendarGrid(currentMonth, groupedActivities),
            streakData: calculateStreak(activities, groupedActivities),
            activeDays: calculateActiveDays(activities, groupedActivities, currentMonth.getFullYear(), currentMonth.getMonth())
        };
    }, [activities, monthOffset]);

    const { daysInMonth, monthYear, grid, streakData, activeDays } = calendarData;

    return (
        <Card
            sx={{
                backgroundColor: mode === 'dark' ? '#1a1a1a' : '#ffffff',
                border: mode === 'dark' ? '1px solid #333' : '1px solid #ddd',
                borderRadius: 2,
                boxShadow: mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <IconButton
                        size="small"
                        onClick={() => setMonthOffset(m => m - 1)}
                        sx={{ p: 0.5 }}
                    >
                        <KeyboardArrowLeftIcon sx={{ color: mode === 'dark' ? '#10b981' : '#059669' }} />
                    </IconButton>

                    <Typography
                        sx={{
                            color: mode === 'dark' ? '#fff' : '#000',
                            fontWeight: '700',
                            fontSize: '1.4rem',
                            textAlign: 'center',
                            flex: 1,
                            whiteSpace: 'nowrap',
                            textTransform: 'uppercase',
                            letterSpacing: 1
                        }}
                    >
                        {monthYear}
                    </Typography>

                    <IconButton
                        size="small"
                        onClick={() => setMonthOffset(m => m + 1)}
                        sx={{ p: 0.5, opacity: monthOffset >= 0 ? 0.4 : 1 }}
                        disabled={monthOffset >= 0}
                    >
                        <KeyboardArrowRightIcon sx={{ color: monthOffset >= 0 ? '#9ca3af' : (mode === 'dark' ? '#10b981' : '#059669') }} />
                    </IconButton>
                </Box>

                {/* Week day headers */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 0 }}>
                    {WEEK_DAYS.map(day => (
                        <Box
                            key={day}
                            sx={{
                                border: `1px solid ${mode === 'dark' ? '#444' : '#000'}`,
                                backgroundColor: mode === 'dark' ? '#2a2a2a' : '#e8e8e8',
                                p: 1,
                                textAlign: 'center'
                            }}
                        >
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: '700', color: mode === 'dark' ? '#fff' : '#000', letterSpacing: 0.5 }}>
                                {day}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {/* Calendar grid */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', flex: 1, mb: 2, borderLeft: `1px solid ${mode === 'dark' ? '#444' : '#ddd'}`, borderBottom: `1px solid ${mode === 'dark' ? '#444' : '#ddd'}` }}>
                    {grid.map((dayData, idx) => (
                        <DayCell key={dayData?.date || `empty-${idx}`} dayData={dayData} mode={mode} isCurrentMonth={dayData?.isCurrentMonth} />
                    ))}
                </Box>

                {/* Stats Footer */}
                {showStats && (
                    <Box sx={{ borderTop: mode === 'dark' ? '1px solid #333' : '1px solid #ddd', pt: 1.5, display: 'flex', gap: 1 }}>
                        <StatItem label=" Days" value={`${activeDays}/${daysInMonth}`} mode={mode} />
                        <StatItem label=" Streak" value={streakData.current} mode={mode} />
                        <StatItem label=" Best" value={streakData.best} mode={mode} />
                    </Box>
                )}

                {/* Empty State */}
                {activities.length === 0 && (
                    <Typography sx={{ textAlign: 'center', fontSize: '0.9rem', color: mode === 'dark' ? '#9ca3af' : '#6b7280', py: 2 }}>
                        No activity yet 
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default ConsistencyCalendar;





