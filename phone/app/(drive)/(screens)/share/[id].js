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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AnimatedPressable from "@/src/components/common/AnimatedPressable";
import { styles } from "@/styles/app/(drive)/(screens)/share/[id].styles";
import { useShareFile } from "@/src/hooks/api/files/useShareFile";
import { useAuth } from "@/src/contexts/AuthContext";
import Icon from "@/src/components/common/Icon";
import PopupModal from "@/src/components/drive/common/PopupModal";

export default function ShareScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const style = useMemo(() => styles({ theme, insets }), [theme, insets]);

  const { user: currentUser } = useAuth();
  const { permissions, loading, refresh, addShare, updateRole, ownerId } =
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

    if (role === "owner") {
      Alert.alert(
        "Transfer Ownership?",
        `Are you sure you want to make ${selectedUser.username} the owner? You will become an admin.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Transfer",
            style: "destructive",
            onPress: async () => {
              try {
                await updateRole(
                  selectedUser.permissionId,
                  selectedUser.userId,
                  "owner",
                );
              } catch (err) {
                Alert.alert("Error", err.message || "Failed to transfer ownership");
              } finally {
                setSelectedUser(null);
              }
            },
          },
        ],
      );
      return;
    }

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

    const isMeOwner = ownerId === currentUser?.id;
    const isTargetOwner = selectedUser.userId === ownerId;

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
        ...(isMeOwner && !isTargetOwner
          ? [
            {
              key: "owner",
              label: "Make Owner",
              icon: "star",
              onPress: () => handleRoleSelect("owner"),
            },
          ]
          : []),
        {
          key: "remove",
          label: "Remove access",
          icon: "bin",
          color: theme.colors.error,
          onPress: () => handleRoleSelect("remove"),
        },
      ],
    };
  }, [selectedUser, ownerId, currentUser?.id, theme.colors.error]);

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
        <Text style={style.roleText}>
          {item.role === "owner" ? "Owner" : item.role}
        </Text>
      </View>

      {/* Show menu dots if:
          1. It's not me (I can't change my own role here easily)
          2. AND (I am the owner OR the target is not the owner)
             (Prevents admins from trying to edit the Owner's permissions)
      */}
      {!item.isCurrentUser && (ownerId === currentUser?.id || item.role !== "owner") && (
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
