// ==UserScript==
// @name         [SNOLAB] Google Calendar keyboard enhance
// @name:en      [SNOLAB] Google Calendar keyboard enhance
// @name:zh      [SNOLAB] Google 日历键盘操作增强
// @name:zh-CN   [SNOLAB] Google 日历键盘操作增强
// @name:zh-TW   [SNOLAB] Google 日曆鍵盤操作增強
// @name:ja      [SNOLAB] Google カレンダー キーボード操作強化
// @name:ko      [SNOLAB] Google 캘린더 키보드 향상
// @name:es      [SNOLAB] Google Calendar mejorado con teclado
// @name:fr      [SNOLAB] Google Calendar amélioration clavier
// @name:de      [SNOLAB] Google Kalender Tastaturverbesserung
// @name:ru      [SNOLAB] Google Календарь улучшение клавиатуры
// @name:ar      [SNOLAB] تحسين لوحة مفاتيح تقويم Google
// @name:pt      [SNOLAB] Google Calendar aprimoramento de teclado
// @name:it      [SNOLAB] Google Calendar miglioramento tastiera
// @name:nl      [SNOLAB] Google Agenda toetsenbordverbetering
// @name:hi      [SNOLAB] Google कैलेंडर कीबोर्ड संवर्धन
// @name:tr      [SNOLAB] Google Takvim klavye geliştirme
// @namespace    https://userscript.snomiao.com/
// @version      0.2.0
// @description  Google Calendar keyboard enhancement. Features: Alt+hjkl to move events, Alt+Shift+hjkl to expand/shrink events, Ctrl+b to toggle menu
// @description:en Google Calendar keyboard enhancement. Features: Alt+hjkl to move events, Alt+Shift+hjkl to expand/shrink events, Ctrl+b to toggle menu
// @description:zh Google日历键盘增强，功能：Alt+hjkl 移动日程事件, Alt+Shift+hjkl 扩展收缩日程事件, Ctrl+b 切换菜单
// @description:zh-CN Google日历键盘增强，功能：Alt+hjkl 移动日程事件, Alt+Shift+hjkl 扩展收缩日程事件, Ctrl+b 切换菜单
// @description:zh-TW Google日曆鍵盤增強，功能：Alt+hjkl 移動日程事件, Alt+Shift+hjkl 擴展收縮日程事件, Ctrl+b 切換菜單
// @description:ja Googleカレンダーのキーボード操作強化。機能：Alt+hjklでイベント移動、Alt+Shift+hjklでイベントの拡大縮小、Ctrl+bでメニュー切り替え
// @description:ko Google 캘린더 키보드 향상. 기능: Alt+hjkl로 이벤트 이동, Alt+Shift+hjkl로 이벤트 확장/축소, Ctrl+b로 메뉴 전환
// @description:es Mejora del teclado de Google Calendar. Funciones: Alt+hjkl para mover eventos, Alt+Shift+hjkl para expandir/contraer eventos, Ctrl+b para alternar menú
// @description:fr Amélioration du clavier Google Calendar. Fonctionnalités: Alt+hjkl pour déplacer les événements, Alt+Shift+hjkl pour étendre/réduire les événements, Ctrl+b pour basculer le menu
// @description:de Google Kalender Tastaturverbesserung. Funktionen: Alt+hjkl zum Verschieben von Ereignissen, Alt+Shift+hjkl zum Erweitern/Verkleinern von Ereignissen, Ctrl+b zum Umschalten des Menüs
// @description:ru Улучшение клавиатуры Google Календаря. Функции: Alt+hjkl для перемещения событий, Alt+Shift+hjkl для расширения/сжатия событий, Ctrl+b для переключения меню
// @description:ar تحسين لوحة مفاتيح تقويم Google. الميزات: Alt+hjkl لنقل الأحداث، Alt+Shift+hjkl لتوسيع/تقليص الأحداث، Ctrl+b لتبديل القائمة
// @description:pt Aprimoramento do teclado do Google Calendar. Recursos: Alt+hjkl para mover eventos, Alt+Shift+hjkl para expandir/reduzir eventos, Ctrl+b para alternar menu
// @description:it Miglioramento della tastiera di Google Calendar. Funzioni: Alt+hjkl per spostare gli eventi, Alt+Shift+hjkl per espandere/ridurre gli eventi, Ctrl+b per attivare/disattivare il menu
// @description:nl Google Agenda toetsenbordverbetering. Functies: Alt+hjkl om gebeurtenissen te verplaatsen, Alt+Shift+hjkl om gebeurtenissen uit te vouwen/in te krimpen, Ctrl+b om menu te schakelen
// @description:hi Google कैलेंडर कीबोर्ड संवर्धन। सुविधाएं: इवेंट्स को मूव करने के लिए Alt+hjkl, इवेंट्स को विस्तार/संकुचित करने के लिए Alt+Shift+hjkl, मेनू टॉगल करने के लिए Ctrl+b
// @description:tr Google Takvim klavye geliştirme. Özellikler: Etkinlikleri taşımak için Alt+hjkl, etkinlikleri genişletmek/daraltmak için Alt+Shift+hjkl, menüyü değiştirmek için Ctrl+b
// @author       snomiao@gmail.com
// @match        *://calendar.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439210/%5BSNOLAB%5D%20Google%20Calendar%20keyboard%20enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/439210/%5BSNOLAB%5D%20Google%20Calendar%20keyboard%20enhance.meta.js
// ==/UserScript==

/* eslint-disable */

(function() {
    'use strict';

    // ============================================================================
    // CONSTANTS
    // ============================================================================

    // Selectors for Google Calendar elements (Japanese locale)
    const SELECTORS = {
        Menu: '[aria-label="メインドロワー"]',
        Summary: [
            '[aria-label="タイトルと日時を追加"]',
            '[aria-label="タイトルを追加"]',
            '[aria-label="タイトル"]'
        ].join(',')
    };

    // ============================================================================
    // UTILITY FUNCTIONS
    // ============================================================================

    // Query all elements matching selector
    function $$(selector, root = document) {
        return Array.from(root.querySelectorAll(selector));
    }

    // Find first visible element matching selector
    function $visible(selector, root = document) {
        const elements = $$(selector, root);
        return elements.find(el => el.getClientRects().length > 0) || null;
    }

    // Get center coordinates of element
    function getCenter(element) {
        const { x, y, width, height } = element.getBoundingClientRect();
        return [x + width / 2, y + height / 2];
    }

    // Add two 2D vectors
    function addVectors([x1, y1], [x2, y2]) {
        return [x1 + x2, y1 + y2];
    }

    // ============================================================================
    // KEYBOARD HANDLER
    // ============================================================================

    function setupKeyboardHandler(handlers) {
        const onKeyDown = (event) => {
            // Build key combination string
            const key = event.code.replace(/^Key/, '').toLowerCase();
            const mods = [];
            if (event.ctrlKey) mods.push('ctrl');
            if (event.altKey) mods.push('alt');
            if (event.shiftKey) mods.push('shift');
            if (event.metaKey) mods.push('meta');

            const combo = [...mods, key].join('+');

            // Check if we have a handler for this combination
            const handler = handlers[combo];
            if (handler) {
                event.stopPropagation();
                event.preventDefault();
                handler(event);
            }
        };

        window.addEventListener('keydown', onKeyDown, true);
        return () => window.removeEventListener('keydown', onKeyDown, true);
    }

    // ============================================================================
    // DRAG STATE MANAGEMENT
    // ============================================================================

    let dragState = null;

    function getDragState() {
        return dragState;
    }

    function setDragState(state) {
        dragState = state;
    }

    // Show visual hint at position
    function showPositionHint([x, y]) {
        const hint = document.createElement('div');
        Object.assign(hint.style, {
            background: 'red',
            position: 'absolute',
            left: x + 'px',
            top: y + 'px',
            width: '1px',
            height: '1px',
            zIndex: '10000',
            pointerEvents: 'none'
        });
        document.body.appendChild(hint);
        setTimeout(() => hint.remove(), 200);
    }

    // ============================================================================
    // EVENT DRAGGING
    // ============================================================================

    function createMouseEvent(type, [x, y]) {
        return new MouseEvent(type, {
            isTrusted: true,
            bubbles: true,
            cancelable: true,
            button: 0,
            buttons: type === 'mousemove' ? 1 : 0,
            clientX: x,
            clientY: y,
            x,
            y
        });
    }

    function eventDrag([dx, dy] = [0, 0], { expand = false } = {}) {
        // Focus summary input if available
        const summaryInput = $visible(SELECTORS.Summary);
        summaryInput?.focus();

        // If not currently dragging, start drag
        if (!getDragState()) {
            // Find the floating event button
            const floatingBtns = [
                ...new Set([
                    ...$$('div[role="button"]').reverse()
                        .filter(e => getComputedStyle(e).zIndex === '5004'),
                    ...$$('div:has([role="button"])').reverse()
                        .filter(e => getComputedStyle(e).zIndex === '5004')
                ])
            ];

            if (floatingBtns.length === 0) {
                throw new Error('No event selected');
            }
            if (floatingBtns.length > 1) {
                throw new Error('Multiple floating buttons found');
            }

            const floatingBtn = floatingBtns[0];

            // Choose drag target: expand handle or entire button
            const target = expand
                ? floatingBtn.querySelector('*[data-dragsource-type="3"]')
                : floatingBtn;

            if (!target) {
                throw new Error('No drag target found');
            }

            const pos = getCenter(target);
            console.log('Starting drag at', pos);

            setDragState({ pos, target });
            showPositionHint(pos);

            // Start drag
            target.dispatchEvent(createMouseEvent('mousedown', pos));
            document.dispatchEvent(createMouseEvent('mousemove', pos));
        }

        // If already dragging, update position
        if (getDragState()) {
            const container = document.querySelector('[role="row"][data-dragsource-type="4"]');
            if (!container) {
                throw new Error('Calendar grid not found');
            }

            const gridcells = $$('[role="gridcell"]', container);
            const containerRect = container.getBoundingClientRect();

            // Calculate cell dimensions
            const cellWidth = containerRect.width / gridcells.length;
            const cellHeight = containerRect.height / 24 / 4; // 24 hours * 4 quarters

            // Calculate new position
            const currentState = getDragState();
            const newPos = addVectors(currentState.pos, [dx * cellWidth, dy * cellHeight]);

            setDragState({ ...currentState, pos: newPos });
            showPositionHint(newPos);

            // Dispatch move event
            document.body.dispatchEvent(createMouseEvent('mousemove', newPos));
        }

        // Setup cleanup on Alt key release
        const cleanup = () => {
            window.removeEventListener('keyup', onKeyUp);
            setDragState(null);
            document.dispatchEvent(createMouseEvent('mouseup', [0, 0]));
        };

        const onKeyUp = (e) => {
            if (e.code === 'AltLeft' || e.code === 'AltRight') {
                cleanup();
            }
        };

        window.addEventListener('keyup', onKeyUp);
        return cleanup;
    }

    // ============================================================================
    // EVENT MOVEMENT & EXPANSION
    // ============================================================================

    function eventMove([dx, dy] = [0, 0]) {
        try {
            return eventDrag([dx, dy]);
        } catch (error) {
            console.error('Failed to move event:', error);
        }
    }

    function eventExpand([dx, dy] = [0, 0]) {
        try {
            return eventDrag([dx, dy], { expand: true });
        } catch (error) {
            console.error('Failed to expand event:', error);
        }
    }

    // ============================================================================
    // MENU TOGGLE
    // ============================================================================

    function toggleMenu() {
        const menuBtn = $visible(SELECTORS.Menu);
        if (menuBtn) {
            menuBtn.click();
        }
    }

    // ============================================================================
    // MAIN INITIALIZATION
    // ============================================================================

    function main() {
        console.log('[SNOLAB] Google Calendar keyboard enhance v0.2.0 loaded');

        // Setup keyboard shortcuts
        const unload = setupKeyboardHandler({
            // Menu toggle
            'ctrl+b': toggleMenu,

            // Event movement (Vim-style hjkl)
            'alt+k': () => eventMove([0, -1]),  // Move up (previous day)
            'alt+j': () => eventMove([0, 1]),   // Move down (next day)
            'alt+h': () => eventMove([-1, 0]),  // Move left (earlier time)
            'alt+l': () => eventMove([1, 0]),   // Move right (later time)

            // Event expansion/shrinking
            'alt+shift+k': () => eventExpand([0, -1]),  // Shrink from bottom
            'alt+shift+j': () => eventExpand([0, 1]),   // Expand to bottom
            'alt+shift+h': () => eventExpand([-1, 0]),  // Shrink from right
            'alt+shift+l': () => eventExpand([1, 0])    // Expand to right
        });

        return unload;
    }

    // Cleanup previous instance if exists
    if (globalThis.gkcs_unload) {
        globalThis.gkcs_unload();
    }

    // Initialize and store cleanup function
    globalThis.gkcs_unload = main();

})();
