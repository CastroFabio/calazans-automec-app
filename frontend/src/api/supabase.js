import { supabase } from "../../supabase-client";

export const handleFetchGroupData = async (category) => {
  const { data, error } = await supabase.from(category).select(`id, group`);

  if (error) {
    console.error(`Error fetching ${category} group:`, error.message);
    return;
  }

  return data;
};

export const handleFetchGroupItemsData = async (
  categoryTableName,
  categoryType,
) => {
  const { data, error } = await supabase
    .from(categoryTableName)
    .select(`id, group, ${categoryType} (id, name)`)
    .order("group", { ascending: true });

  if (error) {
    console.error(`Error fetching ${categoryTableName}:`, error.message);
    return;
  }

  return data;
};

export const handleEditSaveUpdate = async (editingItem, tableName) => {
  if (editingItem.group && editingItem.index !== null) {
    const { error } = await supabase
      .from(tableName)
      .update({ name: editingItem.value })
      .eq("id", editingItem.index);

    if (error) {
      console.error("Error updating:", error.message);
      return;
    }
  }
};

export const handleRemoveJobMaterial = async (tableName, categoryID) => {
  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq("id", categoryID);

  if (error) {
    console.error("Error deleting material:", error.message);
    return;
  }
};

export const handleAddJobMaterial = async (newItem, tableName) => {
  const { error } = await supabase.from(tableName).insert(newItem).single();

  if (error) {
    console.error("Error adding:", error.message);
    return;
  }
};
