import '@/assets/components/common/LoadingSpinner.css'
import BaseThemeContainer from "@templates/BaseThemeContainer.tsx";


interface Iprops {
    width: number;
}


export default function LoadingSpinner({width}: Iprops) {
    const size = width ? width : 50;
    return (
        <BaseThemeContainer>
            <svg viewBox="0 0 100 100" width={size} height={size}>
                <circle
                    fill="none"
                    stroke="#fff"
                    strokeWidth="10"
                    cx="50"
                    cy="50"
                    r="30"
                    style={{opacity: 0.5}}
                />
                <circle fill="#e74c3c" stroke="#e74c3c" strokeWidth="10" cx="22" cy="54" r="8">
                    <animateTransform
                        attributeName="transform"
                        dur="1.5s"
                        type="rotate"
                        from="0 50 48"
                        to="360 50 52"
                        repeatCount="indefinite"
                    />
                </circle>
            </svg>
        </BaseThemeContainer>
    );
}