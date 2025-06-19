# UX Interaction Patterns - Quick Reference

## 🎯 Core Pattern: Interactive Success Confirmations

### Rule: Replace Toast with SweetAlert2 for Form Success
**When:** Form submissions that could lead to multiple workflows (CRUD operations, bulk operations)

**Pattern:**
```typescript
// ✅ DO: Interactive confirmation for workflow choice
const addAnother = await showSuccessDialog(formData.name, 'المنتج');
if (addAnother) {
    resetFormWithPreservation(formData);
    focusFirstInput();
} else {
    router.push('/dashboard/list');
}

// ❌ DON'T: Auto-redirect or simple toast
toast.success('تم الحفظ');
router.push('/dashboard/list'); // Forces workflow
```

### Standard Implementation
```typescript
import Swal from 'sweetalert2';

const showSuccessDialog = async (itemName: string, itemType: string = 'العنصر') => {
    const result = await Swal.fire({
        title: '🎉 تم الحفظ بنجاح!',
        html: `
            <div class="text-center space-y-4">
                <div class="text-lg font-medium text-green-600">
                    تم إنشاء ${itemType} "${itemName}" بنجاح
                </div>
                <div class="text-sm text-gray-600">
                    ماذا تريد أن تفعل الآن؟
                </div>
            </div>
        `,
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: '➕ إضافة آخر',
        cancelButtonText: '📋 عرض القائمة',
        confirmButtonColor: '#16a34a',
        cancelButtonColor: '#7c3aed',
        reverseButtons: true,
        customClass: {
            popup: 'rounded-xl',
            title: 'text-xl font-bold',
            confirmButton: 'px-6 py-3 rounded-lg font-medium',
            cancelButton: 'px-6 py-3 rounded-lg font-medium'
        },
        backdrop: 'rgba(0,0,0,0.4)',
        allowEscapeKey: false,
        allowOutsideClick: false
    });
    return result.isConfirmed;
};
```

## 🔄 Smart Form Reset Pattern

### Rule: Preserve Common Fields in Bulk Operations
```typescript
const resetFormWithPreservation = (currentData: FormData) => {
    const preservedFields = {
        supplierId: currentData.supplierId,
        categoryIds: currentData.categoryIds,
        requiresShipping: currentData.requiresShipping,
        hasQualityGuarantee: currentData.hasQualityGuarantee,
        manageInventory: currentData.manageInventory,
    };
    
    reset({
        id: '',
        name: '',
        description: '',
        price: 0,
        features: [],
        published: false,
        outOfStock: false,
        tags: [],
        ...preservedFields,
    });
};
```

## 📱 Button Patterns

### Single Action Button with Smart Dialog
```jsx
// ✅ DO: Single save button + interactive choice
<Button type="submit" className="btn-add">
    <Save className="h-4 w-4" />
    حفظ المنتج
</Button>

// ❌ DON'T: Multiple confusing action buttons
<Button onClick={() => setAction('save-continue')}>Save & Continue</Button>
<Button onClick={() => setAction('save-view')}>Save & View</Button>
```

## 🎨 Visual Standards

### Colors (Must Use)
- **Confirm (Continue)**: `#16a34a` (Green)
- **Cancel (Navigate)**: `#7c3aed` (Purple)
- **Backdrop**: `rgba(0,0,0,0.4)`

### Text Patterns
- **Arabic RTL**: Proper Arabic text with RTL support
- **Emojis**: ➕ for add, 📋 for view/list, 🎉 for success
- **Consistent Labels**: "إضافة آخر" / "عرض القائمة"

## 🎯 Apply To

### ✅ Management Interfaces (Priority)
- Product Management ✅ 
- Category Management 
- Supplier Management
- User Management
- Promotion Management

### ❌ Don't Apply To
- Login/auth flows
- Read-only views
- Delete confirmations (use different pattern)
- One-time wizards

## 📝 Quick Checklist

- [ ] Import `Swal from 'sweetalert2'`
- [ ] Create `showSuccessDialog` function
- [ ] Implement smart form reset
- [ ] Add focus management
- [ ] Use semantic colors
- [ ] Test RTL layout
- [ ] Add loading states
- [ ] Handle errors gracefully

This pattern significantly improves UX for bulk operations and gives users full control over their workflow. 