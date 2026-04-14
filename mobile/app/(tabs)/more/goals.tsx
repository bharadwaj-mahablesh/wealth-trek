import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Target, CheckCircle, PauseCircle, PlayCircle, Trash2, MessageSquare } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/components/ThemeProvider';
import { useFinancialGoals } from '@/hooks/useFinancialGoals';
import { FinancialGoal } from '@/types';

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatCurrency(value?: number): string {
  if (!value) return '';
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export default function GoalsScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const { activeGoals, pausedGoals, completedGoals, updateGoal, deleteGoal } = useFinancialGoals();

  const bgColor = isDark ? '#0f1115' : '#f7f8fa';
  const textColor = isDark ? '#e8eaf0' : '#1a1e24';
  const mutedColor = isDark ? '#8b9099' : '#64748b';
  const cardBg = isDark ? '#1a1e24' : '#ffffff';
  const borderColor = isDark ? '#252a32' : '#d8dde5';
  const primaryColor = isDark ? '#6ba3b8' : '#1a6b8a';
  const positiveColor = isDark ? '#6aab8a' : '#16a34a';

  const handleDelete = (goal: FinancialGoal) => {
    Alert.alert('Delete Goal', `Delete "${goal.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteGoal(goal.id) },
    ]);
  };

  const GoalCard = ({ goal }: { goal: FinancialGoal }) => {
    const statusColor = goal.status === 'active' ? positiveColor : goal.status === 'paused' ? '#f59e0b' : mutedColor;
    const statusLabel = goal.status === 'active' ? 'Active' : goal.status === 'paused' ? 'Paused' : 'Completed';
    return (
      <View style={{ backgroundColor: cardBg, borderRadius: 14, borderWidth: 1, borderColor, padding: 16, marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: textColor, fontWeight: '700', fontSize: 15, marginBottom: 4 }}>{goal.title}</Text>
            {goal.description ? <Text style={{ color: mutedColor, fontSize: 13, marginBottom: 8 }}>{goal.description}</Text> : null}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {goal.targetAmount ? (
                <View style={{ backgroundColor: isDark ? '#1e2228' : '#eef0f4', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                  <Text style={{ color: primaryColor, fontSize: 12, fontWeight: '600' }}>Target: {formatCurrency(goal.targetAmount)}</Text>
                </View>
              ) : null}
              {goal.targetDate ? (
                <View style={{ backgroundColor: isDark ? '#1e2228' : '#eef0f4', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                  <Text style={{ color: mutedColor, fontSize: 12 }}>By: {formatDate(goal.targetDate)}</Text>
                </View>
              ) : null}
              <View style={{ backgroundColor: isDark ? '#1e2228' : '#eef0f4', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                <Text style={{ color: statusColor, fontSize: 12, fontWeight: '600' }}>{statusLabel}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, gap: 8 }}>
          {goal.status === 'active' ? (
            <TouchableOpacity onPress={() => updateGoal(goal.id, { status: 'paused' })} style={{ padding: 6 }}>
              <PauseCircle size={20} color={mutedColor} />
            </TouchableOpacity>
          ) : goal.status === 'paused' ? (
            <TouchableOpacity onPress={() => updateGoal(goal.id, { status: 'active' })} style={{ padding: 6 }}>
              <PlayCircle size={20} color={positiveColor} />
            </TouchableOpacity>
          ) : null}
          {goal.status !== 'completed' ? (
            <TouchableOpacity onPress={() => updateGoal(goal.id, { status: 'completed' })} style={{ padding: 6 }}>
              <CheckCircle size={20} color={positiveColor} />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={() => handleDelete(goal)} style={{ padding: 6 }}>
            <Trash2 size={20} color="#dc2626" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const totalGoals = activeGoals.length + pausedGoals.length + completedGoals.length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }} edges={['bottom']}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
        {totalGoals === 0 ? (
          <View style={{ backgroundColor: cardBg, borderRadius: 16, borderWidth: 1, borderColor, padding: 32, marginTop: 16, alignItems: 'center' }}>
            <Target size={40} color={primaryColor} style={{ marginBottom: 12 }} />
            <Text style={{ color: textColor, fontWeight: '600', fontSize: 16, marginBottom: 8, textAlign: 'center' }}>No Goals Yet</Text>
            <Text style={{ color: mutedColor, textAlign: 'center', marginBottom: 20 }}>
              Chat with the AI assistant to extract and save financial goals from your conversations.
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/more/chat')}
              style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: primaryColor, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, gap: 8 }}
            >
              <MessageSquare size={18} color={isDark ? '#0f1115' : '#ffffff'} />
              <Text style={{ color: isDark ? '#0f1115' : '#ffffff', fontWeight: '600' }}>Start AI Chat</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {activeGoals.length > 0 ? (
          <>
            <Text style={{ color: textColor, fontWeight: '600', fontSize: 15, marginTop: 16, marginBottom: 10 }}>Active ({activeGoals.length})</Text>
            {activeGoals.map((g) => <GoalCard key={g.id} goal={g} />)}
          </>
        ) : null}

        {pausedGoals.length > 0 ? (
          <>
            <Text style={{ color: textColor, fontWeight: '600', fontSize: 15, marginTop: 8, marginBottom: 10 }}>Paused ({pausedGoals.length})</Text>
            {pausedGoals.map((g) => <GoalCard key={g.id} goal={g} />)}
          </>
        ) : null}

        {completedGoals.length > 0 ? (
          <>
            <Text style={{ color: textColor, fontWeight: '600', fontSize: 15, marginTop: 8, marginBottom: 10 }}>Completed ({completedGoals.length})</Text>
            {completedGoals.map((g) => <GoalCard key={g.id} goal={g} />)}
          </>
        ) : null}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
