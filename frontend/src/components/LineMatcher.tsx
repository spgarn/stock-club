import React, { useState, useRef, useLayoutEffect } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

export interface Connection {
    start: string;
    end: string;
    color: string;
}

interface LineMatcherProps {
    className?: string;
    keys: string[],
    values: string[],
    connections: Connection[],
    setConnections: (v: Connection[]) => void
}

const Container = styled(Box)(({ theme }) => ({
    position: 'relative',
    padding: theme.spacing(4),
    width: '100%',
    height: '100%',
    minHeight: '300px' // Add minimum height to ensure SVG has space
}));

const ColumnsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(8),
    height: '100%',
    position: 'relative', // Make sure this is positioned
    zIndex: 1 // Put this above the SVG layer
}));

const Column = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2)
}));

interface StyledButtonProps {
    isActive?: boolean;
    isDisabled?: boolean;
    buttonColor?: string;
}

const StyledButton = styled(Button, {
    shouldForwardProp: (prop) => !['isActive', 'isDisabled', 'buttonColor'].includes(prop as string),
})<StyledButtonProps>(({ theme, isActive, isDisabled, buttonColor }) => ({
    padding: "10px",
    minWidth: '125px', // Add minimum width
    borderRadius: theme.shape.borderRadius,
    color: 'white',
    backgroundColor: buttonColor || theme.palette.grey[800],
    opacity: isDisabled ? 0.5 : 1,
    transition: theme.transitions.create(['opacity', 'box-shadow']),
    '&:hover': {
        backgroundColor: buttonColor || theme.palette.grey[700],
    },
    ...(isActive && {
        boxShadow: `0 0 0 2px ${theme.palette.common.white}`,
    }),
}));

const SvgLayer = styled('svg')({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 0
});

const LineMatcher: React.FC<LineMatcherProps> = ({ className, keys, values, connections, setConnections }) => {
    const [activeButton, setActiveButton] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [, forceUpdate] = useState({});

    const colors = {
        'Column A': '#1976d2',
        'Column B': '#2e7d32',
        'Column C': '#7b1fa2',
    };

    // Force update on window resize to recalculate lines
    useLayoutEffect(() => {
        const handleResize = () => forceUpdate({});
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleButtonClick = (id: string, isKey: boolean) => {
        if (!activeButton) {
            setActiveButton(id);
        } else if (activeButton !== id) {
            const [first, second] = isKey ? [id, activeButton] : [activeButton, id];
            if (keys.includes(first) && values.includes(second)) {
                const filteredConnections = connections.filter(conn => conn.start !== first);
                setConnections([
                    ...filteredConnections,
                    {
                        start: first,
                        end: second,
                        color: colors[first as keyof typeof colors]
                    }
                ]);
            }
            setActiveButton(null);
        } else {
            setActiveButton(null);
        }
    };

    const deleteLine = (text: string) => {
        setConnections(([...connections.filter(connection => connection.start != text && connection.end != text)]));
        setActiveButton(null)
    }

    const getButtonPosition = (element: HTMLElement) => {
        const rect = element.getBoundingClientRect();
        const containerRect = containerRef.current!.getBoundingClientRect();
        return {
            x: rect.left - containerRect.left + (isEndPoint(element.id) ? 0 : rect.width),
            y: rect.top - containerRect.top + (rect.height / 2)
        };
    };

    const isEndPoint = (id: string) => values.includes(id);

    useLayoutEffect(() => {
        // Force initial render of lines
        forceUpdate({});
    }, [connections]);

    return (
        <Container ref={containerRef} className={className}>
            <SvgLayer>
                {connections.map(({ start, end, color }) => {
                    const startEl = document.getElementById(start);
                    const endEl = document.getElementById(end);

                    if (startEl && endEl) {
                        const startPos = getButtonPosition(startEl);
                        const endPos = getButtonPosition(endEl);

                        return (
                            <line
                                key={`${start}-${end}`}
                                x1={startPos.x}
                                y1={startPos.y}
                                x2={endPos.x}
                                y2={endPos.y}
                                stroke={color}
                                strokeWidth={2}
                            />
                        );
                    }
                    return null;
                })}
            </SvgLayer>

            <ColumnsContainer>
                <Column>
                    {keys.map(key => (
                        <StyledButton
                            key={key}
                            id={key}
                            variant="contained"
                            buttonColor={colors[key as keyof typeof colors]}
                            isActive={activeButton === key}
                            isDisabled={!!activeButton && activeButton !== key}
                            onClick={() => handleButtonClick(key, true)}
                        >
                            {key}
                        </StyledButton>
                    ))}
                </Column>

                <Column>
                    {values.map(value => (
                        <StyledButton
                            key={value}
                            id={value}
                            variant="contained"
                            isActive={activeButton === value}
                            isDisabled={!!activeButton && activeButton !== value}
                            onClick={() => handleButtonClick(value, false)}
                        >
                            {value}
                        </StyledButton>
                    ))}

                    {activeButton && <Button onClick={() => deleteLine(activeButton)}>Trash</Button>}
                </Column>
            </ColumnsContainer>
        </Container>
    );
};

export default LineMatcher;