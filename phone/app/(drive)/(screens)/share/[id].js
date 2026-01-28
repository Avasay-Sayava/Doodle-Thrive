import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { useTheme } from "@/src/contexts/ThemeContext";
import AnimatedPressable from "@/src/components/common/AnimatedPressable";
import { styles } from "@/styles/app/(drive)/(screens)/share/[id].styles";
import { useShareFile } from "@/src/hooks/api/files/useShareFile";
import Icon from "@/src/components/common/Icon";
import PopupModal from "@/src/components/drive/common/PopupModal";

export default function ShareScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const style = useMemo(() => styles({ theme }), [theme]);

  const { permissions, loading, refresh, addShare, updateRole } =
    useShareFile(id);

  const [inputUsername, setInputUsername] = useState("");
  const [adding, setAdding] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    refresh();
  }, []);

  const handleAddUser = async () => {
    if (!inputUsername.trim()) return;
    setAdding(true);
    try {
      await addShare(inputUsername.trim());
      setInputUsername("");
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to share file");
    } finally {
      setAdding(false);
    }
  };

  const openRoleMenu = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleRoleSelect = async (role) => {
    setModalOpen(false);
    if (!selectedUser) return;

    try {
      await updateRole(selectedUser.permissionId, selectedUser.userId, role);
    } catch (err) {
      Alert.alert("Error", "Failed to update role");
    } finally {
      setSelectedUser(null);
    }
  };

  const menuConfig = useMemo(() => {
    if (!selectedUser) return { title: {}, buttons: [] };

    return {
      title: {
        text: selectedUser.username,
        icon: { name: "user" },
      },
      buttons: [
        {
          key: "viewer",
          label: "Viewer",
          icon: selectedUser.role === "viewer" ? "check" : undefined,
          onPress: () => handleRoleSelect("viewer"),
        },
        {
          key: "editor",
          label: "Editor",
          icon: selectedUser.role === "editor" ? "check" : undefined,
          onPress: () => handleRoleSelect("editor"),
        },
        {
          key: "admin",
          label: "Admin",
          icon: selectedUser.role === "admin" ? "check" : undefined,
          onPress: () => handleRoleSelect("admin"),
        },
        {
          key: "remove",
          label: "Remove access",
          icon: "bin",
          color: theme.colors.error,
          onPress: () => handleRoleSelect("remove"),
        },
      ],
    };
  }, [selectedUser, theme.colors.error]);

  const renderItem = ({ item }) => (
    <View style={style.userItem}>
      <View style={style.avatar}>
        <Text style={style.avatarText}>
          {item.username?.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={style.userInfo}>
        <Text style={style.username}>
          {item.username}
          {item.isCurrentUser && " (You)"}
        </Text>
        <Text style={style.roleText}>{item.role}</Text>
      </View>

      {!item.isCurrentUser && (
        <AnimatedPressable
          onPress={() => openRoleMenu(item)}
          style={{ padding: 8 }}
        >
          <Icon name="vertical-dots" size={20} color={theme.colors.textMuted} />
        </AnimatedPressable>
      )}
    </View>
  );

  return (
    <View style={style.container}>
      <Stack.Screen
        options={{
          title: "Share",
          headerBackTitle: "Back",
        }}
      />

      <View style={style.header}>
        <View style={style.inputContainer}>
          <TextInput
            style={style.input}
            placeholder="Add people by username"
            placeholderTextColor={theme.colors.textMuted}
            value={inputUsername}
            onChangeText={setInputUsername}
            autoCapitalize="none"
          />
          <AnimatedPressable
            style={[
              style.addButton,
              { opacity: adding || !inputUsername ? 0.6 : 1 },
            ]}
            backgroundColor={theme.colors.primary}
            onPress={handleAddUser}
            disabled={adding || !inputUsername}
          >
            {adding ? (
              <ActivityIndicator color={theme.colors.background} size="small" />
            ) : (
              <Text style={style.addButtonText}>Add</Text>
            )}
          </AnimatedPressable>
        </View>
      </View>

      <View style={style.listContainer}>
        {loading && !permissions.length ? (
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={style.loadingContainer}
          />
        ) : (
          <FlatList
            data={permissions}
            renderItem={renderItem}
            keyExtractor={(item) => item.userId}
            refreshing={loading}
            onRefresh={refresh}
            ListEmptyComponent={
              <Text style={style.emptyText}>No one has access yet.</Text>
            }
          />
        )}
      </View>

      <PopupModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        config={menuConfig}
      />
    </View>
  );
}
