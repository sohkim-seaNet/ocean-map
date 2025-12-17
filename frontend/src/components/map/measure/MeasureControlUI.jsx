import { useState } from 'react';
import {
    Box,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
    Divider,
    Paper,
    IconButton,
    Collapse,
    Menu,
    MenuItem as MenuItemOption
} from '@mui/material';
import { MdStraighten, MdCropSquare } from 'react-icons/md';
import { IoStopCircle, IoTrashBin, IoChevronUp, IoChevronDown, IoSaveOutline } from 'react-icons/io5';

/**
 * 측정 도구 UI 컴포넌트
 */
function MeasureControlUI({
                              isActive,
                              measureMode,
                              distanceUnit,
                              areaUnit,
                              distanceUnits,
                              areaUnits,
                              onStartDistance,
                              onStartArea,
                              onStop,
                              onClear,
                              onSave,
                              onDistanceUnitChange,
                              onAreaUnitChange,
                              hasMeasurements
                          }) {
    const [expanded, setExpanded] = useState(true);
    const [saveMenuAnchor, setSaveMenuAnchor] = useState(null);

    const handleSaveClick = (event) => {
        setSaveMenuAnchor(event.currentTarget);
    };

    const handleSaveClose = () => {
        setSaveMenuAnchor(null);
    };

    const handleSaveFormat = (format) => {
        onSave(format);
        handleSaveClose();
    };

    // 활성 상태 확인
    const isDistanceActive = isActive && measureMode === 'distance';
    const isAreaActive = isActive && measureMode === 'area';

    return (
        <Paper
            elevation={3}
            className="absolute top-24 left-3"
            sx={{
                minWidth: 180,
                bgcolor: 'background.paper',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
            }}
        >
            {/* 헤더 */}
            <Box
                sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    px: 2,
                    py: 1.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                }}
                onClick={() => setExpanded(!expanded)}
            >
                <Typography variant="subtitle2" fontWeight="bold">
                    측정 도구
                </Typography>
                <IconButton
                    size="small"
                    sx={{ color: 'primary.contrastText', p: 0 }}
                >
                    {expanded ? <IoChevronUp size={20} /> : <IoChevronDown size={20} />}
                </IconButton>
            </Box>

            {/* 접을 수 있는 컨텐츠 */}
            <Collapse in={expanded} timeout="auto">
                <Box sx={{ p: 2 }}>
                    {/* 측정 모드 버튼 - 스타일 개선 */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
                        <Button
                            variant={isDistanceActive ? 'contained' : 'outlined'}
                            onClick={onStartDistance}
                            disabled={isAreaActive} // 면적 측정 중일 때만 비활성화
                            startIcon={<MdStraighten />}
                            fullWidth
                            sx={{
                                justifyContent: 'flex-start',
                                textTransform: 'none',
                                fontWeight: 500,
                                // 활성 상태 스타일 강화
                                ...(isDistanceActive && {
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.4)',
                                    '&:hover': {
                                        bgcolor: 'primary.dark',
                                    }
                                }),
                                // 비활성 상태 스타일
                                ...(!isDistanceActive && !isAreaActive && {
                                    borderColor: 'primary.main',
                                    color: 'primary.main',
                                    bgcolor: 'white',
                                    '&:hover': {
                                        bgcolor: 'primary.light',
                                        color: 'white',
                                    }
                                })
                            }}
                        >
                            거리 측정
                        </Button>

                        <Button
                            variant={isAreaActive ? 'contained' : 'outlined'}
                            onClick={onStartArea}
                            disabled={isDistanceActive} // 거리 측정 중일 때만 비활성화
                            startIcon={<MdCropSquare />}
                            fullWidth
                            sx={{
                                justifyContent: 'flex-start',
                                textTransform: 'none',
                                fontWeight: 500,
                                // 활성 상태 스타일 강화
                                ...(isAreaActive && {
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.4)',
                                    '&:hover': {
                                        bgcolor: 'primary.dark',
                                    }
                                }),
                                // 비활성 상태 스타일
                                ...(!isDistanceActive && !isAreaActive && {
                                    borderColor: 'primary.main',
                                    color: 'primary.main',
                                    bgcolor: 'white',
                                    '&:hover': {
                                        bgcolor: 'primary.light',
                                        color: 'white',
                                    }
                                })
                            }}
                        >
                            면적 측정
                        </Button>
                    </Box>

                    {/* 단위 선택 - 측정 모드일 때만 표시 */}
                    {measureMode === 'distance' && (
                        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                            <InputLabel>단위</InputLabel>
                            <Select
                                value={distanceUnit}
                                label="단위"
                                onChange={(e) => onDistanceUnitChange(e.target.value)}
                            >
                                {distanceUnits.map(unit => (
                                    <MenuItem key={unit.value} value={unit.value}>
                                        {unit.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    {measureMode === 'area' && (
                        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                            <InputLabel>단위</InputLabel>
                            <Select
                                value={areaUnit}
                                label="단위"
                                onChange={(e) => onAreaUnitChange(e.target.value)}
                            >
                                {areaUnits.map(unit => (
                                    <MenuItem key={unit.value} value={unit.value}>
                                        {unit.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    <Divider sx={{ my: 1.5 }} />

                    {/* 제어 버튼 */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Button
                            variant="outlined"
                            onClick={onStop}
                            disabled={!isActive}
                            startIcon={<IoStopCircle />}
                            fullWidth
                            size="small"
                            sx={{ textTransform: 'none' }}
                        >
                            종료
                        </Button>

                        <Button
                            variant="outlined"
                            color="success"
                            onClick={handleSaveClick}
                            disabled={!hasMeasurements}
                            startIcon={<IoSaveOutline />}
                            fullWidth
                            size="small"
                            sx={{ textTransform: 'none' }}
                        >
                            저장
                        </Button>

                        <Button
                            variant="outlined"
                            color="error"
                            onClick={onClear}
                            disabled={!hasMeasurements}
                            startIcon={<IoTrashBin />}
                            fullWidth
                            size="small"
                            sx={{ textTransform: 'none' }}
                        >
                            삭제
                        </Button>
                    </Box>
                </Box>
            </Collapse>

            {/* 저장 포맷 선택 메뉴 */}
            <Menu
                anchorEl={saveMenuAnchor}
                open={Boolean(saveMenuAnchor)}
                onClose={handleSaveClose}
            >
                <MenuItemOption onClick={() => handleSaveFormat('geojson')}>
                    GeoJSON (.geojson)
                </MenuItemOption>
                <MenuItemOption onClick={() => handleSaveFormat('csv')}>
                    CSV (.csv)
                </MenuItemOption>
            </Menu>
        </Paper>
    );
}

export default MeasureControlUI;