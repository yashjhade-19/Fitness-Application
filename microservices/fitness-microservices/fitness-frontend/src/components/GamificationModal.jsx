import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from "@mui/material";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const GamificationModal = ({ open, onClose, title, message, coins, onClaim }) => {
    const { mode } = useTheme();
    const [claiming, setClaiming] = useState(false);

    const handleClaim = async () => {
        setClaiming(true);
        try {
            await onClaim?.();
            onClose?.();
        } finally {
            setClaiming(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: mode === 'dark' ? '#1a1a1a' : '#ffffff',
                    borderRadius: 3,
                    border: mode === 'dark' ? '1px solid #333' : '1px solid #e0e0e0'
                }
            }}
        >
            <DialogContent>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    py: 3,
                    gap: 2
                }}>
                    <EmojiEventsIcon sx={{
                        fontSize: 60,
                        color: '#FFD700'
                    }} />

                    <Typography variant="h5" sx={{
                        fontWeight: 'bold',
                        color: mode === 'dark' ? '#fff' : '#333',
                        textAlign: 'center'
                    }}>
                        🎉 {title}
                    </Typography>

                    <Typography variant="body1" sx={{
                        color: mode === 'dark' ? '#ccc' : '#666',
                        textAlign: 'center'
                    }}>
                        {message}
                    </Typography>

                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        backgroundColor: mode === 'dark' ? '#2a2a2a' : '#f5f5f5',
                        px: 3,
                        py: 2,
                        borderRadius: 2,
                        mt: 2
                    }}>
                        <Typography variant="h4" sx={{
                            fontWeight: 'bold',
                            color: '#FFD700'
                        }}>
                            +{coins}
                        </Typography>
                        <Typography variant="h6" sx={{
                            color: mode === 'dark' ? '#fff' : '#333'
                        }}>
                            FitCoins
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button onClick={onClose} disabled={claiming}>
                    Later
                </Button>
                <Button
                    onClick={handleClaim}
                    variant="contained"
                    color="success"
                    disabled={claiming}
                >
                    {claiming ? "Claiming..." : "Claim"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GamificationModal;
