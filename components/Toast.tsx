import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useUiStore } from '@/store';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react-native';

interface ToastItemProps {
  toast: {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    duration?: number;
  };
  onClose: () => void;
}

export function ToastContainer() {
  const toasts = useUiStore((state) => state.toastMessages);
  const removeToast = useUiStore((state) => state.removeToast);
  
  if (toasts.length === 0) return null;
  
  return (
    <View style={styles.container}>
      {toasts.map((toast) => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          onClose={() => removeToast(toast.id)} 
        />
      ))}
    </View>
  );
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        delay: toast.duration || 3000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  }, []);
  
  const getToastIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle color="#22C55E" size={20} />;
      case 'error':
        return <AlertCircle color="#EF4444" size={20} />;
      case 'warning':
        return <AlertTriangle color="#F59E0B" size={20} />;
      case 'info':
      default:
        return <Info color="#3B82F6" size={20} />;
    }
  };
  
  const getToastStyle = () => {
    switch (toast.type) {
      case 'success':
        return styles.successToast;
      case 'error':
        return styles.errorToast;
      case 'warning':
        return styles.warningToast;
      case 'info':
      default:
        return styles.infoToast;
    }
  };
  
  return (
    <Animated.View 
      style={[
        styles.toast,
        getToastStyle(),
        { opacity: fadeAnim }
      ]}
    >
      <View style={styles.iconContainer}>
        {getToastIcon()}
      </View>
      <Text style={styles.message}>{toast.message}</Text>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <X size={16} color="#666" />
      </TouchableOpacity>
    </Animated.View>
  );
}

// Helper function to display toast from anywhere in the app
export function showToast(
  message: string, 
  type: 'success' | 'error' | 'info' | 'warning' = 'info',
  duration = 3000
) {
  useUiStore.getState().addToast({
    message,
    type,
    duration,
  });
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  toast: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successToast: {
    backgroundColor: '#DCFCE7',
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E',
  },
  errorToast: {
    backgroundColor: '#FEE2E2',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  warningToast: {
    backgroundColor: '#FEF3C7',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  infoToast: {
    backgroundColor: '#DBEAFE',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  iconContainer: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
}); 