// SPDX-FileCopyrightText: 2021 Johannes Loher
//
// SPDX-License-Identifier: MIT

import { packageName } from '../const';
import { deleteAllDrawings } from '../delete-all-drawings';
import { getGame } from '../helpers';
import { libWrapper } from '../shims/libWrapperShim';

export default function registerDrawingsLayerWrappers() {
  libWrapper.register(packageName, 'DrawingsLayer.prototype.getDocuments', getDocuments, 'WRAPPER');

  const game = getGame();
  if (game.settings.get(packageName, 'clearDrawingsOnlyOnActiveLayer')) {
    const deleteAllTarget = 'DrawingsLayer.prototype.deleteAll';
    try {
      libWrapper.register(packageName, deleteAllTarget, deleteAll, 'OVERRIDE');
    } catch (e) {
      logger.warn(`Failed to override ${deleteAllTarget}, some things might not work correctly:`, e);
    }
  }
}

function getDocuments(wrapped: DrawingsLayer['getDocuments']) {
  return wrapped().filter((doc) => !doc.data.flags[packageName]?.foreground);
}

async function deleteAll() {
  return deleteAllDrawings({ foreground: false });
}
