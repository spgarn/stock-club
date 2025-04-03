
import Conf from 'react-confetti';
import useWindowDimensions from '../../../hooks/useWindowDimensions';

export const Confetti = () => {
    const { width, height } = useWindowDimensions()
    return (
        <Conf
            width={width}
            height={height}
        />
    )
}