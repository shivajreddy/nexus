import '@/assets/components/common/LoadingSpinner.css'
import BaseThemeContainer from "@templates/BaseThemeContainer.tsx";


export default function LoadingSpinner() {
    return (
        <BaseThemeContainer>
            <div className="spinner-container">
                <div className="loading-spinner">
                </div>
            </div>
        </BaseThemeContainer>
    );
}